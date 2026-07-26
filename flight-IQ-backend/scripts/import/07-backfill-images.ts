import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/prisma/client';

const conn = process.env.DATABASE_URL!;
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: conn }) } as any);

const USER_AGENT = 'FlightIQ-Backend-Backfill/1.0';

function isImageUrl(url: string): boolean {
  const ext = url.split('.').pop()?.toLowerCase().split(/[?#]/)[0] || '';
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
}

async function queryWikimedia(query: string): Promise<string | null> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrwhat=text&prop=imageinfo&iiprop=url|mime&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json() as any;
    if (data?.query?.pages) {
      const pages = Object.values(data.query.pages) as any[];
      const imagePage = pages.find((p: any) =>
        p.imageinfo?.some((info: any) =>
          info.mime?.startsWith('image/') && isImageUrl(info.url)
        )
      );
      if (imagePage) return imagePage.imageinfo[0].url;
    }
  } catch { /* ignore */ }
  return null;
}

async function fetchImage(aircraft: { id: string; registrationNo: string | null; make: string | null; model: string | null }): Promise<string | null> {
  if (aircraft.registrationNo && aircraft.registrationNo.trim().length > 2) {
    const r = await queryWikimedia(`${aircraft.registrationNo} aircraft`);
    if (r) return r;
    const r2 = await queryWikimedia(aircraft.registrationNo);
    if (r2) return r2;
  }
  if (aircraft.make && aircraft.model) {
    const q = `${aircraft.make} ${aircraft.model}`.trim();
    const r = await queryWikimedia(`${q} aircraft`);
    if (r) return r;
    const r2 = await queryWikimedia(q);
    if (r2) return r2;
  }
  if (aircraft.make) {
    const r = await queryWikimedia(`${aircraft.make} aircraft`);
    if (r) return r;
  }
  return null;
}

async function main() {
  const total = await prisma.$queryRawUnsafe<{cnt: bigint}[]>('SELECT COUNT(*) as cnt FROM aircraft WHERE image_url IS NULL');
  console.log(`Aircraft needing images: ${total[0].cnt}`);

  let updated = 0;
  let failed = 0;
  let skipped = 0;

  // Process in batches
  let offset = 0;
  const batchSize = 50;
  let done = false;

  while (!done) {
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, registration_no, make, model FROM aircraft WHERE image_url IS NULL ORDER BY id LIMIT ${batchSize} OFFSET ${offset}`
    );

    if (rows.length === 0) break;
    offset += rows.length;

    for (const row of rows) {
      const url = await fetchImage(row);
      if (url) {
        await prisma.$executeRawUnsafe(`UPDATE aircraft SET image_url = $1 WHERE id = $2`, url, row.id);
        updated++;
        process.stdout.write('.');
      } else {
        failed++;
        process.stdout.write('x');
      }
      if ((updated + failed + skipped) % 100 === 0) {
        process.stdout.write(` [${updated} ok, ${failed} fail]\n`);
      }
    }

    await new Promise(r => setTimeout(r, 5000));
  }

  console.log(`\nDone: ${updated} updated, ${failed} no image found, ${skipped} skipped`);
  await prisma.$disconnect();
}
main().catch(console.error);
