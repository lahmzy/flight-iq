import 'dotenv/config';
import { PrismaClient, FindingCategory } from '../../prisma/generated/prisma/client';
import { ImportService } from './import.service';
import * as path from 'path';

const COL = {
  ev_id: 0,
  Aircraft_Key: 1,
  finding_no: 2,
  finding_code: 3,
  finding_description: 4,
} as const;

// NTSB files typically have no header row, so we map columns by index.
const HEADERS = Array.from({ length: 50 }, (_, i) => `c_${i}`);

interface FindingRow {
  ntsbEventId: string;
  ntsbAircraftKey: number;
  findingNo: number;
  findingCode?: string;
  description?: string;
  category: FindingCategory;
}

const mapRow = (record: Record<string, string>) => {
  const evId = record[`c_${COL.ev_id}`]?.trim();
  const keyRaw = record[`c_${COL.Aircraft_Key}`]?.trim();
  const noRaw = record[`c_${COL.finding_no}`]?.trim();

  if (!evId || !keyRaw || !noRaw) {
    return { success: false as const, error: 'Missing ev_id, Aircraft_Key, or finding_no' };
  }

  const ntsbAircraftKey = parseInt(keyRaw, 10);
  const findingNo = parseInt(noRaw, 10);

  if (isNaN(ntsbAircraftKey) || isNaN(findingNo)) {
    return { success: false as const, error: `Invalid numeric key/no: ${keyRaw} or ${noRaw}` };
  }

  const findingCode = record[`c_${COL.finding_code}`]?.trim() || undefined;
  const description = record[`c_${COL.finding_description}`]?.trim() || undefined;

  // Determine top-level category from the start of the description
  let category: FindingCategory = FindingCategory.Other;
  if (description) {
    if (description.startsWith('Personnel')) category = FindingCategory.Personnel;
    else if (description.startsWith('Environmental')) category = FindingCategory.Environmental;
    else if (description.startsWith('Aircraft')) category = FindingCategory.Aircraft;
    else if (description.startsWith('Organizational') || description.startsWith('Organization')) category = FindingCategory.Organization;
  }

  const data: FindingRow = {
    ntsbEventId: evId,
    ntsbAircraftKey,
    findingNo,
    findingCode,
    description,
    category,
  };

  return { success: true as const, data };
};

let existingAircraftKeys: Set<string> | null = null;

const batchHandler = async (prisma: PrismaClient, rows: FindingRow[]) => {
  if (!existingAircraftKeys) {
    const aircraft = await prisma.aircraft.findMany({
      select: { ntsbEventId: true, ntsbAircraftKey: true },
    });
    existingAircraftKeys = new Set(aircraft.map(a => `${a.ntsbEventId}_${a.ntsbAircraftKey}`));
  }

  const valid = rows.filter(r => existingAircraftKeys!.has(`${r.ntsbEventId}_${r.ntsbAircraftKey}`));
  if (valid.length === 0) return;

  await prisma.finding.createMany({ data: valid, skipDuplicates: true });
};

(async () => {
  const csvPath = path.resolve(__dirname, '../../data/ntsb/findings.csv');

  const service = new ImportService<FindingRow>(
    csvPath,
    mapRow,
    batchHandler,
    {
      chunkSize: 1000,
      parseOptions: {
        headers: HEADERS,
        discardUnmappedColumns: true,
      },
    }
  );

  try {
    await service.run();
    console.log('✅ Findings import completed successfully');
  } catch (err) {
    console.error('❌ Findings import failed:', err);
    process.exit(1);
  }
})();
