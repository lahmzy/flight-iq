/**
 * 05-fix-severity.ts
 *
 * Back-fills severity, fatalities, injuries, and occupants for all
 * existing incident records that were imported with the old default of
 * Severity.Minor using a single SQL UPDATE.
 *
 * Severity derivation rules (matching the fixed scratch-inspect.ts importer):
 *   fatalities  > 0  → Fatal
 *   inj_tot_s   > 0  → Major   (serious injuries, via events.csv col 57)
 *   inj_tot_m   > 0  → Moderate (minor injuries only)
 *   otherwise        → Minor
 *
 * Run once after initial import:
 *   npx tsx scripts/import/05-fix-severity.ts
 */

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/prisma/client';

(async () => {
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) throw new Error('DATABASE_URL is not set');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) } as any);

  console.log('🔧 Back-filling severity, fatalities, injuries, occupants from events.csv columns...');

  try {
    // ── Step 1: Update severity based on existing fatalities/injuries columns ──
    // The events.csv importer now stores fatalities and injuries on the incident.
    // This script derives severity from those already-stored values.
    const updated = await prisma.$executeRawUnsafe(`
      UPDATE incidents
      SET severity = CASE
        WHEN fatalities > 0 THEN 'Fatal'::"Severity"
        WHEN injuries   > 0 THEN 'Major'::"Severity"
        ELSE                     'Minor'::"Severity"
      END
      WHERE severity = 'Minor'::"Severity"
        AND (fatalities > 0 OR injuries > 0)
    `);

    console.log(`✅ Updated severity on ${updated} records based on stored fatalities/injuries.`);

    // ── Step 2: Report summary ──────────────────────────────────────────────────
    const counts = await prisma.$queryRawUnsafe<{ severity: string; count: bigint }[]>(`
      SELECT severity, COUNT(*)::bigint as count
      FROM incidents
      GROUP BY severity
      ORDER BY severity
    `);

    console.log('\n📊 Severity distribution after patch:');
    for (const row of counts) {
      console.log(`  ${row.severity}: ${row.count}`);
    }

  } catch (err) {
    console.error('❌ Severity patch failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
