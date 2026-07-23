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
 *
 * Uses a single SQL UPDATE with JOIN — fast and atomic.
 */

const FORCE_OVERWRITE = process.argv.includes('--force');

(async () => {
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) } as any);

  try {
    console.log(`🔗 Denormalising narratives${FORCE_OVERWRITE ? ' (--force)' : ''}…`);

    // Build the UPDATE query.
    // Joins incidents → incident_aircraft (isPrimary) → aircraft → aircraft_narratives.
    const whereClause = FORCE_OVERWRITE
      ? ''  // update all matching rows
      : `AND (i.summary IS NULL OR i.official_cause IS NULL)`;

    const sql = `
      UPDATE incidents i
      SET
        summary = COALESCE(
          NULLIF(an.narrative_accp, ''),
          NULLIF(an.narrative_inc, ''),
          NULLIF(an.narrative_accf, ''),
          i.summary
        ),
        official_cause = COALESCE(
          NULLIF(an.narrative_cause, ''),
          i.official_cause
        )
      FROM incident_aircraft ia
      JOIN aircraft a ON a.id = ia.aircraft_id
      JOIN aircraft_narratives an
        ON an.ntsb_event_id = a.ntsb_event_id
       AND an.ntsb_aircraft_key = a.ntsb_aircraft_key
      WHERE ia.incident_id = i.id
        AND ia.is_primary = true
        ${whereClause};
    `;

    const result = await prisma.$executeRawUnsafe(sql);

    console.log(`\n✅ Denormalisation complete. ${result} row(s) updated.`);
  } catch (err) {
    console.error('❌ Denormalisation failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
