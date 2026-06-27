import 'dotenv/config';
import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ImportService } from './import.service';
import * as path from 'path';

// ─── Column positions in the NTSB aircraft.csv (no header row) ──────────────
// Identified by inspecting the raw data rows.
const COL = {
  ev_id:          0,  // NTSB event id
  Aircraft_Key:   1,  // Aircraft key (integer)
  regis_no:       2,  // Registration number
  acft_make:      11, // Manufacturer (make)
  acft_model:     12, // Model
  acft_series:    13, // Series
  acft_serial_no: 14, // Serial number
  acft_category:  16, // Aircraft category (AIR, HELI, etc.)
  cert_max_gr_wt: 15, // Max gross weight (int)
  homebuilt:      18, // Homebuilt (Y/N)
} as const;

// Generate a generic header row large enough to cover all columns.
// When `headers` is a string[], fast-csv does NOT consume the first file row
// as a header — every row is treated as data from the start.
const HEADERS = Array.from({ length: 100 }, (_, i) => `c_${i}`);

/**
 * Shape of the data we extract from each row.
 * Field names match the Prisma Aircraft model exactly.
 */
interface AircraftRow {
  ntsbEventId:     string;
  ntsbAircraftKey: number;
  registrationNo?: string;
  make?:           string;
  model?:          string;
  series?:         string;
  serialNo?:       string;
  ntsbCategory?:   string;
  certMaxGrossWeight?: number;
  homebuilt:       boolean;
}

/**
 * Map a positional CSV record (keyed c_0, c_1 …) to our AircraftRow shape.
 */
const mapRow = (record: Record<string, string>) => {
  const evId   = record[`c_${COL.ev_id}`]?.trim();
  const keyRaw = record[`c_${COL.Aircraft_Key}`]?.trim();

  if (!evId || !keyRaw) {
    return { success: false as const, error: 'Missing ev_id or Aircraft_Key' };
  }

  const ntsbAircraftKey = parseInt(keyRaw, 10);
  if (isNaN(ntsbAircraftKey)) {
    return { success: false as const, error: `Invalid Aircraft_Key: "${keyRaw}"` };
  }

  const certWeightRaw = record[`c_${COL.cert_max_gr_wt}`]?.trim();
  const certMaxGrossWeight = certWeightRaw ? parseInt(certWeightRaw, 10) : undefined;

  const homebuiltRaw = record[`c_${COL.homebuilt}`]?.trim()?.toUpperCase();
  const homebuilt = homebuiltRaw === 'Y' || homebuiltRaw === 'YES' || homebuiltRaw === 'TRUE' || homebuiltRaw === '1';

  const data: AircraftRow = {
    ntsbEventId:     evId,
    ntsbAircraftKey,
    registrationNo:  record[`c_${COL.regis_no}`]?.trim()       || undefined,
    make:            record[`c_${COL.acft_make}`]?.trim()       || undefined,
    model:           record[`c_${COL.acft_model}`]?.trim()      || undefined,
    series:          record[`c_${COL.acft_series}`]?.trim()     || undefined,
    serialNo:        record[`c_${COL.acft_serial_no}`]?.trim()  || undefined,
    ntsbCategory:    record[`c_${COL.acft_category}`]?.trim()   || undefined,
    certMaxGrossWeight: isNaN(certMaxGrossWeight as any) ? undefined : certMaxGrossWeight,
    homebuilt,
  };

  return { success: true as const, data };
};

/**
 * Persist a batch of valid rows using upsert so the script is re-runnable.
 */
const batchHandler = async (prisma: PrismaClient, rows: AircraftRow[]) => {
  await prisma.$transaction(
    async (tx) => {
      await Promise.all(
        rows.map((row) =>
          tx.aircraft.upsert({
            where: {
              ntsbEventId_ntsbAircraftKey: {
                ntsbEventId:     row.ntsbEventId,
                ntsbAircraftKey: row.ntsbAircraftKey,
              },
            },
            update: {
              registrationNo:     row.registrationNo,
              make:               row.make,
              model:              row.model,
              series:             row.series,
              serialNo:           row.serialNo,
              ntsbCategory:       row.ntsbCategory,
              certMaxGrossWeight: row.certMaxGrossWeight,
              homebuilt:          row.homebuilt,
            },
            create: {
              ntsbEventId:        row.ntsbEventId,
              ntsbAircraftKey:    row.ntsbAircraftKey,
              registrationNo:     row.registrationNo,
              make:               row.make,
              model:              row.model,
              series:             row.series,
              serialNo:           row.serialNo,
              ntsbCategory:       row.ntsbCategory,
              certMaxGrossWeight: row.certMaxGrossWeight,
              homebuilt:          row.homebuilt,
            },
          })
        )
      );
    },
    {
      timeout: 30000, // 30 seconds timeout
    }
  );
};

(async () => {
  const csvPath = path.resolve(__dirname, '../../data/ntsb/aircraft.csv');

  const service = new ImportService<AircraftRow>(
    csvPath,
    mapRow,
    batchHandler,
    {
      chunkSize: 100, // Reduced from 500 to prevent database connection saturation/timeouts
      parseOptions: {
        // Provide explicit headers so fast-csv does NOT consume any data row
        // as a header, and discardUnmappedColumns handles rows with extra fields.
        headers:               HEADERS,
        discardUnmappedColumns: true,
      },
    }
  );

  try {
    await service.run();
    console.log('✅ Aircraft import completed successfully');
  } catch (err) {
    console.error('❌ Aircraft import failed:', err);
    process.exit(1);
  }
})();
