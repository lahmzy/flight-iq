import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/prisma/client';

const connectionString = process.env['DATABASE_URL']!;
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) } as any);

async function main() {
  const ids = ['20101206X61618','20101124X13845','20120117X54454','20150210X13614','20081231X95619'];
  for (const id of ids) {
    const count = await prisma.finding.count({ where: { ntsbEventId: id } });
    console.log(`${id} -> ${count} findings`);
  }
  const total = await prisma.finding.count();
  console.log(`Total findings in DB: ${total}`);
  await prisma.$disconnect();
}
main().catch(console.error);
