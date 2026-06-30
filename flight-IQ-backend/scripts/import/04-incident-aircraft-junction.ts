import 'dotenv/config';
import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

(async () => {
  console.log('Connecting to database...');
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) } as any);

  try {
    console.log('Running SQL to populate incident_aircraft junction table...');
    
    const result = await prisma.$executeRawUnsafe(`
      INSERT INTO incident_aircraft (incident_id, aircraft_id, is_primary)
      SELECT 
        i.id AS incident_id, 
        a.id AS aircraft_id, 
        CASE WHEN a.ntsb_aircraft_key = 1 THEN true ELSE false END AS is_primary
      FROM incidents i
      JOIN aircraft a ON i.ntsb_event_id = a.ntsb_event_id
      ON CONFLICT (incident_id, aircraft_id) DO NOTHING;
    `);

    console.log(`✅ Successfully populated incident_aircraft junction table.`);
    console.log(`Rows affected: ${result}`);

  } catch (error) {
    console.error('❌ Failed to populate incident_aircraft:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
