import 'dotenv/config';
import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

(async () => {
  const connectionString = process.env['DATABASE_URL']!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) } as any);
  try {
    const count = await prisma.aircraftNarrative.count();
    console.log(`Total AircraftNarrative rows in DB: ${count}`);
  } finally {
    await prisma.$disconnect();
  }
})();
