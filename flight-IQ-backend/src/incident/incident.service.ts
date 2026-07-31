import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from 'prisma/generated/prisma/browser';

import { PrismaService } from 'src/infastructure/services/prisma/prisma.service';
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  GetIncidentsQueryDto,
} from './incident.dto';

/** Allowed sort columns — prevents SQL injection via raw column names */
const ALLOWED_SORT_COLUMNS = new Set([
  'incidentDate',
  'createdAt',
  'updatedAt',
  'title',
  'severity',
  'fatalities',
  'location',
]);

// ─── Includes ──────────────────────────────────────────────────────────────────

/** Lightweight relations returned in list queries */
const listInclude = {
  aircraft: { include: { aircraft: { include: { findings: true } } } },
  tags: { include: { tag: true } },
  _count: { select: { tags: true, comments: true } },
} satisfies Prisma.IncidentInclude;

/** Full relations returned in detail queries */
const detailInclude = {
  aircraft: { include: { aircraft: { include: { narrative: true, findings: true } } } },
  tags: { include: { tag: true } },
  sources: true,
  _count: { select: { comments: true } },
} satisfies Prisma.IncidentInclude;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

function parseDate(d: string | undefined): Date | undefined {
  if (!d) return undefined;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

// ─── Service ───────────────────────────────────────────────────────────────────

import { AircraftImageService } from './aircraft-image.service';

@Injectable()
export class IncidentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: AircraftImageService,
  ) {}

  // ── Create ────────────────────────────────────────────────────────────────

  async createIncident(dto: CreateIncidentDto) {
    // Validate foreign keys
    const aircraft = await this.prisma.aircraft.findUnique({
      where: { id: dto.aircraftId },
    });
    if (!aircraft) {
      throw new BadRequestException(
        `Aircraft with id '${dto.aircraftId}' not found`,
      );
    }

    // Generate unique slug
    const base = slugify(dto.title);
    let slug = base;
    let suffix = 2;
    while (await this.prisma.incident.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix}`;
      suffix++;
    }

    // Extract tagIds and relation-specific fields before spreading into Prisma create
    const {
      tagIds,
      aircraftId,
      flightNumber,
      registration,
      phase,
      location,
      lessonsLearned,
      ...data
    } = dto;

    return this.prisma.incident.create({
      data: {
        ...data,
        slug,
        incidentDate: new Date(dto.incidentDate),
        ...(location ? { city: location } : {}),
        ...(lessonsLearned ? { aiLessonsLearned: lessonsLearned } : {}),
        aircraft: {
          create: {
            aircraftId,
            isPrimary: true,
          },
        },
        tags:
          tagIds && tagIds.length > 0
            ? { create: tagIds.map((tagId) => ({ tagId })) }
            : undefined,
      },
      include: listInclude,
    });
  }

  // ── Find All ──────────────────────────────────────────────────────────────

  async getAllIncidents(query: GetIncidentsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    // --- where --------------------------------------------------------------
    const where: Prisma.IncidentWhereInput = {};

    if (query.severity) where.severity = { in: query.severity };
    if (query.status) where.status = { in: query.status };
    if (query.country) where.country = query.country;
    if (query.aircraftId || query.findingCategory) {
      const aircraftAnd: any[] = [];
      if (query.aircraftId) aircraftAnd.push({ aircraftId: query.aircraftId });
      if (query.findingCategory) {
        aircraftAnd.push({
          aircraft: { findings: { some: { category: { in: query.findingCategory } } } },
        });
      }
      where.aircraft = { some: { AND: aircraftAnd } };
    }

    // Date range
    const start = parseDate(query.startDate);
    const end = parseDate(query.endDate);
    if (start || end) {
      where.incidentDate = {
        ...(start ? { gte: start } : {}),
        ...(end ? { lte: end } : {}),
      };
    }

    // Has coordinates filter
    if (query.hasCoordinates) {
      where.latitude = { not: null };
      where.longitude = { not: null };
    }

    // Full-text search across title, summary, officialCause, city, state, country
    if (query.q) {
      const q = query.q.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { officialCause: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { state: { contains: q, mode: 'insensitive' } },
        { country: { contains: q, mode: 'insensitive' } },
      ];
    }

    // --- orderBy ------------------------------------------------------------
    const sortBy = ALLOWED_SORT_COLUMNS.has(query.sortBy ?? '')
      ? query.sortBy!
      : 'incidentDate';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    // Default: incidents with officialCause first, then by user sort
    const orderBy = [
      { officialCause: { sort: 'desc', nulls: 'last' } },
      { [sortBy]: sortOrder },
    ] satisfies Prisma.IncidentOrderByWithRelationInput[];

    // --- execute ------------------------------------------------------------
    const [data, total] = await Promise.all([
      this.prisma.incident.findMany({
        where,
        include: listInclude,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.incident.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  // ── Statistics ──────────────────────────────────────────────────

  /**
   * Aggregates the full incident dataset into the shapes consumed by the
   * /statistics dashboard. One payload — no pagination.
   */
  async getStatistics() {
    // --- KPIs ----------------------------------------------------------------
    const [kpiRows, yearly, monthly, causeSeverity, aircraftCatRaw, aircraftTypes, countryAgg] =
      await Promise.all([
        this.prisma.$queryRawUnsafe<Array<{
          total: number; fatalEvents: number; totalFatalities: number; totalInjuries: number; countries: number;
        }>>(
          `SELECT
             COUNT(*)::int AS "total",
             COUNT(*) FILTER (WHERE fatalities > 0)::int AS "fatalEvents",
             COALESCE(SUM(fatalities), 0)::int AS "totalFatalities",
             COALESCE(SUM(injuries), 0)::int AS "totalInjuries",
             COUNT(DISTINCT NULLIF(TRIM(country), ''))::int AS "countries"
           FROM incidents`,
        ),

        this.prisma.$queryRawUnsafe<Array<{ year: number; total: number; fatal: number; injuries: number }>>(
          `SELECT
             EXTRACT(YEAR FROM incident_date)::int AS year,
             COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE fatalities > 0)::int AS fatal,
             COALESCE(SUM(injuries), 0)::int AS injuries
           FROM incidents
           WHERE incident_date >= '2008-01-01'
           GROUP BY 1 ORDER BY 1`,
        ),

        this.prisma.$queryRawUnsafe<Array<{ month: number; incidents: number }>>(
          `SELECT
             EXTRACT(MONTH FROM incident_date)::int AS month,
             COUNT(*)::int AS incidents
           FROM incidents
           WHERE incident_date >= '2008-01-01'
           GROUP BY 1 ORDER BY 1`,
        ),

        this.prisma.$queryRawUnsafe<Array<{ category: string; fatal: number; nonFatal: number }>>(
          `SELECT
             f.category,
             COUNT(DISTINCT i.id) FILTER (WHERE i.fatalities > 0)::int AS fatal,
             COUNT(DISTINCT i.id) FILTER (WHERE i.fatalities = 0)::int AS "nonFatal"
           FROM findings f
           JOIN aircraft a ON a.ntsb_event_id = f.ntsb_event_id AND a.ntsb_aircraft_key = f.ntsb_aircraft_key
           JOIN incident_aircraft ia ON ia.aircraft_id = a.id
           JOIN incidents i ON i.id = ia.incident_id
           GROUP BY 1`,
        ),

        this.prisma.$queryRawUnsafe<Array<{ code: string; count: number }>>(
          `SELECT
             UPPER(COALESCE(NULLIF(TRIM(ntsb_category), ''), 'UNK')) AS code,
             COUNT(*)::int AS count
           FROM aircraft
           GROUP BY 1 ORDER BY count DESC`,
        ),

        this.prisma.$queryRawUnsafe<Array<{ type: string; incidents: number; fatal: number }>>(
          `SELECT
             (UPPER(COALESCE(NULLIF(TRIM(make), ''), 'UNKNOWN')) || ' ' || UPPER(COALESCE(NULLIF(TRIM(model), ''), ''))) AS type,
             COUNT(DISTINCT ia.incident_id)::int AS incidents,
             COUNT(DISTINCT ia.incident_id) FILTER (WHERE i.fatalities > 0)::int AS fatal
           FROM aircraft a
           JOIN incident_aircraft ia ON ia.aircraft_id = a.id
           JOIN incidents i ON i.id = ia.incident_id
           GROUP BY 1
           ORDER BY incidents DESC
           LIMIT 8`,
        ),

        this.prisma.$queryRawUnsafe<Array<{ country: string; incidents: number; fatalities: number }>>(
          `SELECT
             NULLIF(TRIM(country), '') AS country,
             COUNT(*)::int AS incidents,
             COALESCE(SUM(fatalities), 0)::int AS fatalities
           FROM incidents
           WHERE incident_date >= '2008-01-01'
           GROUP BY 1`,
        ),
      ]);

    // --- Cause categories (from Finding enum) --------------------------------
    const findingGroup = await this.prisma.finding.groupBy({
      by: ['category'],
      _count: { _all: true },
    });
    const causeCategories = findingGroup
      .map((g) => ({ name: g.category, count: g._count._all }))
      .sort((a, b) => b.count - a.count);

    // --- Cause severity radar (counts → percentage share for comparability) ---
    const causeSeverityRadar = causeSeverity.map((row) => {
      const total = row.fatal + row.nonFatal;
      return {
        subject: row.category,
        fatal: total > 0 ? Math.round((row.fatal / total) * 100) : 0,
        nonFatal: total > 0 ? Math.round((row.nonFatal / total) * 100) : 0,
      };
    });

    // --- Aircraft category breakdown (ntsb_category → label) ------------------
    const AIRCRAFT_CATEGORY_LABELS: Record<string, string> = {
      AIR: 'Airplane',
      HELI: 'Helicopter',
      GLI: 'Glider',
      BALL: 'Balloon',
      PPAR: 'Powered Parachute',
      WSFT: 'Weight-Shift',
      GYRO: 'Gyrocopter',
      ULTR: 'Ultralight',
      UNK: 'Unknown',
    };
    // Merge unmapped / junk codes (e.g. numeric gross-weight leaks) into 'Other'
    const aircraftCatBuckets: Record<string, number> = {};
    for (const r of aircraftCatRaw) {
      const name = AIRCRAFT_CATEGORY_LABELS[r.code] ?? 'Other';
      aircraftCatBuckets[name] = (aircraftCatBuckets[name] ?? 0) + r.count;
    }
    const aircraftCategories = Object.entries(aircraftCatBuckets)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // --- Region breakdown (country → region) ----------------------------------
    const regions = this.buildRegionBreakdown(countryAgg);

    // --- Monthly distribution (all-time) --------------------------------------
    const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyData = monthly.map((r) => ({
      month: MONTH_NAMES[r.month - 1] ?? String(r.month),
      incidents: r.incidents,
    }));

    return {
      kpi: kpiRows[0] ?? { total: 0, fatalEvents: 0, totalFatalities: 0, totalInjuries: 0, countries: 0 },
      yearly,
      monthly: monthlyData,
      causeCategories,
      causeSeverityRadar,
      aircraftCategories,
      aircraftTypes,
      regions,
    };
  }

  // ── Region mapping helpers ────────────────────────────────────────────────

  private readonly REGION_MAP: Record<string, string> = {
    // North America
    US: 'North America', USA: 'North America', CA: 'North America', MX: 'North America',
    GT: 'North America', HN: 'North America', CR: 'North America', PA: 'North America',
    DO: 'North America', BS: 'North America', JM: 'North America', DM: 'North America',
    CU: 'North America', HT: 'North America', BZ: 'North America', NI: 'North America',
    SV: 'North America', PR: 'North America', TT: 'North America', BB: 'North America',
    // South America
    BR: 'South America', CO: 'South America', PE: 'South America', EC: 'South America',
    AR: 'South America', VE: 'South America', CL: 'South America', GY: 'South America',
    BO: 'South America', PY: 'South America', UY: 'South America', SR: 'South America',
    // Europe
    GB: 'Europe', FR: 'Europe', DE: 'Europe', ES: 'Europe', IT: 'Europe', CH: 'Europe',
    SE: 'Europe', AT: 'Europe', BE: 'Europe', PT: 'Europe', NL: 'Europe', PL: 'Europe',
    NO: 'Europe', IS: 'Europe', HU: 'Europe', FI: 'Europe', GR: 'Europe', RO: 'Europe',
    DK: 'Europe', UA: 'Europe', CZ: 'Europe', LV: 'Europe', HR: 'Europe', IE: 'Europe',
    BY: 'Europe', SK: 'Europe', LT: 'Europe', EE: 'Europe', SI: 'Europe', BG: 'Europe',
    RS: 'Europe', LU: 'Europe', MT: 'Europe', AD: 'Europe', MC: 'Europe', RU: 'Europe',
    // Middle East
    SA: 'Middle East', AE: 'Middle East', IL: 'Middle East', IR: 'Middle East',
    TR: 'Middle East', EG: 'Middle East', JO: 'Middle East', KW: 'Middle East',
    QA: 'Middle East', BH: 'Middle East', OM: 'Middle East', LB: 'Middle East',
    SY: 'Middle East', IQ: 'Middle East', YE: 'Middle East',
    // Africa
    ZA: 'Africa', NG: 'Africa', KE: 'Africa', CD: 'Africa', TZ: 'Africa', NA: 'Africa',
    ET: 'Africa', DZ: 'Africa', MA: 'Africa', TN: 'Africa', GH: 'Africa', ZW: 'Africa',
    ZM: 'Africa', UG: 'Africa', RW: 'Africa', MZ: 'Africa', AO: 'Africa', CM: 'Africa',
    CI: 'Africa', SN: 'Africa', ML: 'Africa', BW: 'Africa', CG: 'Africa', GA: 'Africa',
    GM: 'Africa', GN: 'Africa', SL: 'Africa', LR: 'Africa', NE: 'Africa', TD: 'Africa',
    SD: 'Africa', MW: 'Africa', SZ: 'Africa', LS: 'Africa', BF: 'Africa', BJ: 'Africa',
    TG: 'Africa', MR: 'Africa', CV: 'Africa', MG: 'Africa', MU: 'Africa', SC: 'Africa',
    // Asia-Pacific
    AU: 'Asia-Pacific', NZ: 'Asia-Pacific', JP: 'Asia-Pacific', ID: 'Asia-Pacific',
    IN: 'Asia-Pacific', CN: 'Asia-Pacific', KR: 'Asia-Pacific', TH: 'Asia-Pacific',
    TW: 'Asia-Pacific', SG: 'Asia-Pacific', HK: 'Asia-Pacific', PG: 'Asia-Pacific',
    PH: 'Asia-Pacific', MY: 'Asia-Pacific', NP: 'Asia-Pacific', AF: 'Asia-Pacific',
    LK: 'Asia-Pacific', BD: 'Asia-Pacific', VN: 'Asia-Pacific', MM: 'Asia-Pacific',
    KH: 'Asia-Pacific', FJ: 'Asia-Pacific', LA: 'Asia-Pacific', BT: 'Asia-Pacific',
    TL: 'Asia-Pacific', WS: 'Asia-Pacific', TO: 'Asia-Pacific', VU: 'Asia-Pacific',
    SB: 'Asia-Pacific', MN: 'Asia-Pacific', KZ: 'Asia-Pacific', PK: 'Asia-Pacific',
  };

  /** Normalize a raw country value to a stable region bucket. */
  private countryToRegion(country: string | null | undefined): string {
    if (!country) return 'Other';
    const key = country.trim().toUpperCase();
    return this.REGION_MAP[key] ?? 'Other';
  }

  /** Aggregate incident counts + fatalities into the six display regions. */
  private buildRegionBreakdown(
    rows: Array<{ country: string | null; incidents: number; fatalities: number }>,
  ) {
    const REGION_ORDER = ['North America', 'Europe', 'Asia-Pacific', 'South America', 'Middle East', 'Africa', 'Other'];
    const buckets: Record<string, { incidents: number; fatalities: number }> = {};

    for (const row of rows) {
      const region = this.countryToRegion(row.country);
      const bucket = (buckets[region] ??= { incidents: 0, fatalities: 0 });
      bucket.incidents += row.incidents;
      bucket.fatalities += row.fatalities;
    }

    return REGION_ORDER.filter((r) => buckets[r]).map((r) => ({
      region: r,
      incidents: buckets[r].incidents,
      fatalities: buckets[r].fatalities,
    }));
  }

  // ── Map Markers ──────────────────────────────────────────────────

  /**
   * Returns the minimal fields needed to render incident markers on a map.
   * Only includes records that have both latitude and longitude.
   */
  async getMapMarkers(limit = 200) {
    const markers = await this.prisma.incident.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        severity: true,
        status: true,
        evType: true,
        incidentDate: true,
        latitude: true,
        longitude: true,
        fatalities: true,
        city: true,
        country: true,
        aircraft: {
          take: 1,
          orderBy: { isPrimary: 'desc' },
          select: {
            aircraft: {
              select: {
                make: true,
                model: true,
                registrationNo: true,
                operatorName: true,
                flightPhase: true,
              },
            },
          },
        },
      },
      orderBy: { incidentDate: 'desc' },
      take: limit,
    });
    return markers;
  }

  // ── Find By Slug ──────────────────────────────────────────────────────────

  async getIncidentBySlug(slug: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { slug },
      include: detailInclude,
    });

    if (!incident) {
      throw new NotFoundException(`Incident with slug '${slug}' not found`);
    }

    // Ensure images are populated for all aircraft
    for (const link of incident.aircraft) {
      if (link.aircraft) {
        const narrative = link.aircraft.narrative;
        link.aircraft = {
          ...await this.imageService.ensureAircraftImage(link.aircraft),
          narrative,
        } as typeof link.aircraft;
      }
    }

    // Fallback: if aircraft array is empty and summary/officialCause are still
    // null, look up AircraftNarrative directly by ntsbEventId
    await this.applyNarrativeFallback(incident);

    return incident;
  }

  // ── Find By ID ────────────────────────────────────────────────────────────

  async getIncidentById(id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: detailInclude,
    });

    if (!incident) {
      throw new NotFoundException(`Incident with id '${id}' not found`);
    }

    // Ensure images are populated for all aircraft
    for (const link of incident.aircraft) {
      if (link.aircraft) {
        const narrative = link.aircraft.narrative;
        link.aircraft = {
          ...await this.imageService.ensureAircraftImage(link.aircraft),
          narrative,
        } as typeof link.aircraft;
      }
    }

    // Fallback: if aircraft array is empty and summary/officialCause are still
    // null, look up AircraftNarrative directly by ntsbEventId
    await this.applyNarrativeFallback(incident);

    return incident;
  }

  // ── Private Helpers ────────────────────────────────────────────────────────

  /**
   * Fallback: if summary or officialCause are still null after the denormalisation
   * script (06), query AircraftNarrative directly by ntsbEventId.
   * Populates the fields in-memory only — no extra DB write.
   */
  private async applyNarrativeFallback(
    incident: { ntsbEventId: string | null; aircraft: unknown[]; summary: string | null; officialCause: string | null },
  ): Promise<void> {
    // Both fields already populated — nothing to do
    if (incident.summary && incident.officialCause) return;
    if (!incident.ntsbEventId) return;

    const narrative = await this.prisma.aircraftNarrative.findFirst({
      where: { ntsbEventId: incident.ntsbEventId },
      orderBy: { ntsbAircraftKey: 'asc' }, // Aircraft_Key = 1 first
    });

    if (!narrative) return;

    if (!incident.summary) {
      incident.summary =
        narrative.narrativeAccp?.trim() ||
        narrative.narrativeInc?.trim() ||
        narrative.narrativeAccf?.trim() ||
        null;
    }
    if (!incident.officialCause) {
      incident.officialCause = narrative.narrativeCause?.trim() || null;
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────

  async updateIncident(id: string, dto: UpdateIncidentDto) {
    const existing = await this.prisma.incident.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Incident with id '${id}' not found`);
    }

    // Validate foreign keys if being changed
    if (dto.aircraftId) {
      const aircraft = await this.prisma.aircraft.findUnique({
        where: { id: dto.aircraftId },
      });
      if (!aircraft) {
        throw new BadRequestException(
          `Aircraft with id '${dto.aircraftId}' not found`,
        );
      }
    }

    // Regenerate slug if title changes
    let slug: string | undefined;
    if (dto.title && dto.title !== existing.title) {
      const base = slugify(dto.title);
      slug = base;
      let suffix = 2;
      while (
        await this.prisma.incident.findFirst({
          where: { slug, id: { not: id } },
        })
      ) {
        slug = `${base}-${suffix}`;
        suffix++;
      }
    }

    // Extract tagIds and relation-specific fields before spreading into Prisma update
    const {
      tagIds,
      aircraftId,
      flightNumber,
      registration,
      phase,
      location,
      lessonsLearned,
      ...data
    } = dto;

    // Handle tag reassignment: disconnect all, then connect new set
    const tagUpdate =
      tagIds !== undefined
        ? {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
          }
        : undefined;

    // Handle aircraft connection update
    const aircraftUpdate = aircraftId
      ? {
          deleteMany: {},
          create: { aircraftId, isPrimary: true },
        }
      : undefined;

    return this.prisma.incident.update({
      where: { id },
      data: {
        ...data,
        ...(slug ? { slug } : {}),
        ...(dto.incidentDate
          ? { incidentDate: new Date(dto.incidentDate) }
          : {}),
        ...(location ? { city: location } : {}),
        ...(lessonsLearned ? { aiLessonsLearned: lessonsLearned } : {}),
        ...(tagUpdate ? { tags: tagUpdate } : {}),
        ...(aircraftUpdate ? { aircraft: aircraftUpdate } : {}),
      },
      include: listInclude,
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async deleteIncident(id: string) {
    const existing = await this.prisma.incident.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Incident with id '${id}' not found`);
    }

    await this.prisma.incident.delete({ where: { id } });

    return { message: 'Incident deleted successfully' };
  }
}
