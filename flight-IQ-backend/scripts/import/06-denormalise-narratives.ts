import 'dotenv/config';
import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * 06-denormalise-narratives.ts
 *
 * Copies the primary aircraft's NTSB narrative text back into the parent
 * Incident row so that GET /incidents list queries and the detail page
 * can access summary/officialCause without joining through aircraft.
 *
 * Priority:
 *   Incident.summary       ← narrativeAccp ?? narrativeInc ?? narrativeAccf
 *   Incident.officialCause ← narrativeCause
 *
 * Safe to re-run: skips incidents where both fields are already populated.
 * Pass --force flag to overwrite existing values.
 */

const CHUNK_SIZE = 200;
const FORCE_OVERWRITE = process.argv.includes('--force');

const createPrisma = (connectionString: string): PrismaClient =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new PrismaClient({ adapter: new PrismaPg({ connectionString }) } as any);

(async () => {
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const prisma = createPrisma(connectionString);

  try {
    console.log('🔗 Fetching primary aircraft links with narratives…');

    // Count total to process
    const totalCount = await prisma.incidentAircraft.count({
      where: {
        isPrimary: true,
        aircraft: {
          narrative: {
            isNot: null,
          },
        },
      },
    });
    console.log(`   Found ${totalCount} primary aircraft links with narrative data.`);

    const counters = { updated: 0, skipped: 0, noNarrative: 0 };
    let offset = 0;

    while (offset < totalCount) {
      const links = await prisma.incidentAircraft.findMany({
        where: {
          isPrimary: true,
          aircraft: {
            narrative: {
              isNot: null,
            },
          },
        },
        include: {
          aircraft: {
            include: {
              narrative: true,
            },
          },
          incident: {
            select: {
              id: true,
              summary: true,
              officialCause: true,
            },
          },
        },
        skip: offset,
        take: CHUNK_SIZE,
        orderBy: { incidentId: 'asc' },
      });

      for (const link of links) {
        const narrative = link.aircraft.narrative;
        const incident = link.incident;

        if (!narrative) {
          counters.noNarrative++;
          continue;
        }

        // Skip if already populated and not force-overwriting
        const alreadyHasSummary = !!incident.summary?.trim();
        const alreadyHasCause = !!incident.officialCause?.trim();
        if (alreadyHasSummary && alreadyHasCause && !FORCE_OVERWRITE) {
          counters.skipped++;
          continue;
        }

        const newSummary =
          narrative.narrativeAccp?.trim() ||
          narrative.narrativeInc?.trim() ||
          narrative.narrativeAccf?.trim() ||
          null;

        const newCause = narrative.narrativeCause?.trim() || null;

        // Only update fields that are null (or all if --force)
        const updateData: { summary?: string; officialCause?: string } = {};

        if ((!alreadyHasSummary || FORCE_OVERWRITE) && newSummary) {
          updateData.summary = newSummary;
        }
        if ((!alreadyHasCause || FORCE_OVERWRITE) && newCause) {
          updateData.officialCause = newCause;
        }

        if (Object.keys(updateData).length === 0) {
          counters.skipped++;
          continue;
        }

        await prisma.incident.update({
          where: { id: incident.id },
          data: updateData,
        });

        counters.updated++;
      }

      offset += CHUNK_SIZE;
      console.log(
        `   ↳ ${Math.min(offset, totalCount)}/${totalCount} — updated: ${counters.updated}, skipped: ${counters.skipped}`,
      );
    }

    console.log(
      `\n✅ Denormalisation complete.`,
      `\n   Updated:     ${counters.updated}`,
      `\n   Skipped:     ${counters.skipped} (already populated)`,
      `\n   No narrative: ${counters.noNarrative}`,
    );
  } finally {
    await prisma.$disconnect();
  }
})();
