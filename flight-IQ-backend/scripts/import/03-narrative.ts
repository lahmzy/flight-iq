import 'dotenv/config';
import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'csv-parse';

const COL = {
  ev_id:        0,
  Aircraft_Key: 1,
  narr_accp:    2,
  narr_accf:    3,
  narr_cause:   4,
  narr_inc:     5,
} as const;

const CHUNK_SIZE = 20; // parallel upserts per batch
const MAX_RETRIES = 3;

interface NarrativeRow {
  ntsbEventId: string;
  ntsbAircraftKey: number;
  narrativeAccp?: string;
  narrativeAccf?: string;
  narrativeCause?: string;
  narrativeInc?: string;
}

const mapRow = (record: string[]): NarrativeRow | null => {
  const evId   = record[COL.ev_id]?.trim();
  const keyRaw = record[COL.Aircraft_Key]?.trim();

  if (!evId || !keyRaw) return null;

  const ntsbAircraftKey = parseInt(keyRaw, 10);
  if (isNaN(ntsbAircraftKey)) return null;

  return {
    ntsbEventId:     evId,
    ntsbAircraftKey,
    narrativeAccp:   record[COL.narr_accp]?.trim()  || undefined,
    narrativeAccf:   record[COL.narr_accf]?.trim()  || undefined,
    narrativeCause:  record[COL.narr_cause]?.trim() || undefined,
    narrativeInc:    record[COL.narr_inc]?.trim()   || undefined,
  };
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const createPrisma = (connectionString: string): PrismaClient =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new PrismaClient({ adapter: new PrismaPg({ connectionString }) } as any);

/** Upsert one row. Returns 'upserted' | 'skipped' | throws on unexpected errors. */
const upsertOne = async (
  prisma: PrismaClient,
  row: NarrativeRow,
): Promise<'upserted' | 'skipped'> => {
  try {
    await prisma.aircraftNarrative.upsert({
      where: {
        ntsbEventId_ntsbAircraftKey: {
          ntsbEventId: row.ntsbEventId,
          ntsbAircraftKey: row.ntsbAircraftKey,
        },
      },
      update: {
        narrativeAccp: row.narrativeAccp,
        narrativeAccf: row.narrativeAccf,
        narrativeCause: row.narrativeCause,
        narrativeInc: row.narrativeInc,
      },
      create: {
        ntsbEventId: row.ntsbEventId,
        ntsbAircraftKey: row.ntsbAircraftKey,
        narrativeAccp: row.narrativeAccp,
        narrativeAccf: row.narrativeAccf,
        narrativeCause: row.narrativeCause,
        narrativeInc: row.narrativeInc,
      },
    });
    return 'upserted';
  } catch (err: any) {
    if (err?.code === 'P2003') return 'skipped'; // no parent Aircraft row
    throw err;
  }
};

/**
 * Process a batch of rows concurrently with Promise.allSettled.
 * Re-creates a fresh Prisma client per batch to avoid stale connections.
 */
const processBatch = async (
  rows: NarrativeRow[],
  connectionString: string,
  counters: { upserted: number; skipped: number },
): Promise<void> => {
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    const prisma = createPrisma(connectionString);
    try {
      const results = await Promise.allSettled(
        rows.map((row) => upsertOne(prisma, row)),
      );
      for (const result of results) {
        if (result.status === 'fulfilled') {
          if (result.value === 'upserted') counters.upserted++;
          else counters.skipped++;
        } else {
          // Unexpected per-row error — log and count as skipped
          console.warn('  ⚠ Row error (skipped):', result.reason?.message ?? result.reason);
          counters.skipped++;
        }
      }
      return;
    } catch (err: any) {
      attempt++;
      const isConnErr =
        err?.message?.includes('Connection terminated') ||
        err?.message?.includes('ECONNRESET');
      if (isConnErr && attempt < MAX_RETRIES) {
        console.warn(`  ⚡ Connection dropped, retrying batch (attempt ${attempt}/${MAX_RETRIES})…`);
        await sleep(1000 * attempt);
      } else {
        throw err;
      }
    } finally {
      await prisma.$disconnect();
    }
  }
};

(async () => {
  const csvPath = path.resolve(__dirname, '../../data/ntsb/narrative.csv');
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      relax_quotes: true,
      relax_column_count: true,
      skip_empty_lines: true,
    }),
  );

  const counters = { upserted: 0, skipped: 0 };
  let total = 0;
  let batch: NarrativeRow[] = [];

  try {
    for await (const record of parser) {
      const row = mapRow(record);
      if (!row) continue;
      total++;
      batch.push(row);

      if (batch.length >= CHUNK_SIZE) {
        await processBatch(batch, connectionString, counters);
        batch = [];
        if (total % 500 === 0) {
          console.log(
            `  ↳ ${total} rows processed — ${counters.upserted} upserted, ${counters.skipped} skipped`,
          );
        }
      }
    }
  } catch (err: any) {
    // CSV_QUOTE_NOT_CLOSED is a known NTSB data quality issue at EOF — treat as soft end-of-file
    if (err?.code === 'CSV_QUOTE_NOT_CLOSED') {
      console.warn(`  ⚠ CSV parse warning: unclosed quote at line ${err?.lines ?? '?'} — treating as end of file.`);
    } else {
      console.error('❌ Narrative import failed:', err);
      process.exit(1);
    }
  }

  // Flush remainder (runs whether the loop ended cleanly or via CSV_QUOTE_NOT_CLOSED)
  try {
    if (batch.length > 0) {
      await processBatch(batch, connectionString, counters);
    }
    console.log(
      `\n✅ Narrative import complete — ${counters.upserted} upserted, ${counters.skipped} skipped (no parent Aircraft) out of ${total} total rows.`,
    );
  } catch (err) {
    console.error('❌ Narrative import failed during final flush:', err);
    process.exit(1);
  }
})();
