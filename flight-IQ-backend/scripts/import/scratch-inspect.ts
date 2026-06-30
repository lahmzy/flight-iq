import 'dotenv/config';
import { PrismaClient, EvType, Severity, InvestigationStatus } from '../../prisma/generated/prisma/client';
import { ImportService } from './import.service';
import * as path from 'path';

// ─── Column positions in the NTSB events.csv (no header row) ──────────────
const COL = {
  ev_id: 0,
  ntsb_no: 1,
  ev_type: 2,
  ev_date: 3,
  ev_city: 7,
  ev_state: 8,
  ev_country: 9,
  apt_name: 18,
} as const;

// NTSB files typically have no header row, so we map columns by index.
const HEADERS = Array.from({ length: 120 }, (_, i) => `c_${i}`);

interface IncidentRow {
  ntsbEventId: string;
  ntsbNo?: string;
  slug: string;
  evType?: EvType;
  severity: Severity;
  incidentDate: Date;
  city?: string;
  state?: string;
  country?: string;
  aptName?: string;
  latitude?: number;
  longitude?: number;
}

const mapRow = (record: Record<string, string>) => {
  const evId = record[`c_${COL.ev_id}`]?.trim();
  if (!evId) {
    return { success: false as const, error: 'Missing ev_id' };
  }

  const ntsbNo = record[`c_${COL.ntsb_no}`]?.trim();
  
  let evType: EvType | undefined;
  const rawEvType = record[`c_${COL.ev_type}`]?.trim().toUpperCase();
  if (rawEvType === 'ACC' || rawEvType === 'ACCIDENT') evType = EvType.Accident;
  else if (rawEvType === 'INC' || rawEvType === 'INCIDENT') evType = EvType.Incident;

  const evDateRaw = record[`c_${COL.ev_date}`]?.trim();
  const incidentDate = evDateRaw ? new Date(evDateRaw) : new Date(1970, 0, 1);
  if (isNaN(incidentDate.getTime())) {
    return { success: false as const, error: `Invalid ev_date: "${evDateRaw}"` };
  }

  // The last two columns typically contain the decimal latitude and longitude
  // We'll iterate backwards to find the last two non-empty columns that look like floats
  let latitude: number | undefined;
  let longitude: number | undefined;
  
  const values = Object.values(record);
  for (let i = values.length - 1; i >= 0; i--) {
    const val = values[i]?.trim();
    if (val && !isNaN(parseFloat(val)) && val.includes('.')) {
      if (longitude === undefined) {
        longitude = parseFloat(val);
      } else if (latitude === undefined) {
        latitude = parseFloat(val);
        break;
      }
    }
  }

  const data: IncidentRow = {
    ntsbEventId: evId,
    ntsbNo: ntsbNo || undefined,
    slug: `ntsb-${evId.toLowerCase()}`,
    evType,
    severity: Severity.Minor, // Default severity as it is required
    incidentDate,
    city: record[`c_${COL.ev_city}`]?.trim() || undefined,
    state: record[`c_${COL.ev_state}`]?.trim() || undefined,
    country: record[`c_${COL.ev_country}`]?.trim() || undefined,
    aptName: record[`c_${COL.apt_name}`]?.trim() || undefined,
    latitude,
    longitude,
  };

  return { success: true as const, data };
};

const batchHandler = async (prisma: PrismaClient, rows: IncidentRow[]) => {
  await prisma.$transaction(
    async (tx) => {
      for (const row of rows) {
        await tx.incident.upsert({
          where: { ntsbEventId: row.ntsbEventId },
          update: {
            ntsbNo: row.ntsbNo,
            evType: row.evType,
            incidentDate: row.incidentDate,
            city: row.city,
            state: row.state,
            country: row.country,
            aptName: row.aptName,
            latitude: row.latitude,
            longitude: row.longitude,
          },
          create: {
            ntsbEventId: row.ntsbEventId,
            ntsbNo: row.ntsbNo,
            slug: row.slug,
            evType: row.evType,
            severity: row.severity,
            status: InvestigationStatus.UnderInvestigation,
            incidentDate: row.incidentDate,
            city: row.city,
            state: row.state,
            country: row.country,
            aptName: row.aptName,
            latitude: row.latitude,
            longitude: row.longitude,
          },
        });
      }
    },
    {
      timeout: 120000, // 2 minutes timeout
    }
  );
};

(async () => {
  const csvPath = path.resolve(__dirname, '../../data/ntsb/events.csv');

  const service = new ImportService<IncidentRow>(
    csvPath,
    mapRow,
    batchHandler,
    {
      chunkSize: 100,
      parseOptions: {
        headers: HEADERS,
        discardUnmappedColumns: true,
      },
    }
  );

  try {
    await service.run();
    console.log('✅ Incident import completed successfully');
  } catch (err) {
    console.error('❌ Incident import failed:', err);
    process.exit(1);
  }
})();
