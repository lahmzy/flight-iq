import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/prisma/client';

const conn = process.env.DATABASE_URL!;
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: conn }) } as any);

async function main() {
  const total = await prisma.$queryRawUnsafe<{cnt: bigint}[]>('SELECT COUNT(*) as cnt FROM aircraft');
  const withImg = await prisma.$queryRawUnsafe<{cnt: bigint}[]>('SELECT COUNT(*) as cnt FROM aircraft WHERE image_url IS NOT NULL');
  const nullImg = await prisma.$queryRawUnsafe<{cnt: bigint}[]>('SELECT COUNT(*) as cnt FROM aircraft WHERE image_url IS NULL');
  console.log(`Total: ${total[0].cnt} | with: ${withImg[0].cnt} | null: ${nullImg[0].cnt}`);

  const bad = await prisma.$queryRawUnsafe<any[]>(
    `SELECT id, registration_no, make, model, image_url FROM aircraft WHERE image_url ILIKE '%.pdf%' OR image_url ILIKE '%.svg%'`
  );
  console.log(`Bad (pdf/svg): ${bad.length}`);
  for (const a of bad) {
    console.log(`  ${a.registration_no} | ${a.make} ${a.model} | ${(a.image_url || '').substring(0, 90)}`);
  }

  if (bad.length > 0) {
    const ids = bad.map((a: any) => a.id);
    await prisma.$executeRawUnsafe(`UPDATE aircraft SET image_url = NULL WHERE id = ANY($1)`, ids);
    console.log(`Cleared ${ids.length} bad image_urls`);
  }

  // Also reset any generic Boeing 737 fallback on non-Boeing aircraft
  const resetCount = await prisma.$executeRawUnsafe(
    `UPDATE aircraft SET image_url = NULL WHERE image_url = 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Boeing_737-400_Centralwings_2.JPG' AND (make IS NULL OR make NOT ILIKE '%boeing%')`
  );
  console.log(`Reset ${resetCount} mismatched generic fallback images`);

  const finalWith = await prisma.$queryRawUnsafe<{cnt: bigint}[]>('SELECT COUNT(*) as cnt FROM aircraft WHERE image_url IS NOT NULL');
  const finalNull = await prisma.$queryRawUnsafe<{cnt: bigint}[]>('SELECT COUNT(*) as cnt FROM aircraft WHERE image_url IS NULL');
  console.log(`After cleanup: with: ${finalWith[0].cnt} | null: ${finalNull[0].cnt}`);

  await prisma.$disconnect();
}
main().catch(console.error);
