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
  aircraft: true,
  airline: true,
  _count: { select: { tags: true, comments: true } },
} satisfies Prisma.IncidentInclude;

/** Full relations returned in detail queries */
const detailInclude = {
  aircraft: true,
  airline: true,
  tags: { include: { tag: true } },
  timelineEvents: { orderBy: { sortOrder: 'asc' as const } },
  contributingFactors: { orderBy: { sortOrder: 'asc' as const } },
  videos: true,
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

@Injectable()
export class IncidentService {
  constructor(private readonly prisma: PrismaService) {}

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

    if (dto.airlineId) {
      const airline = await this.prisma.airline.findUnique({
        where: { id: dto.airlineId },
      });
      if (!airline) {
        throw new BadRequestException(
          `Airline with id '${dto.airlineId}' not found`,
        );
      }
    }

    // Generate unique slug
    const base = slugify(dto.title);
    let slug = base;
    let suffix = 2;
    while (await this.prisma.incident.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix}`;
      suffix++;
    }

    // Extract tagIds before spreading into Prisma create
    const { tagIds, ...data } = dto;

    return this.prisma.incident.create({
      data: {
        ...data,
        slug,
        incidentDate: new Date(dto.incidentDate),
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

    if (query.severity) where.severity = query.severity;
    if (query.status) where.status = query.status;
    if (query.country) where.country = query.country;
    if (query.aircraftId) where.aircraftId = query.aircraftId;
    if (query.airlineId) where.airlineId = query.airlineId;

    // Date range
    const start = parseDate(query.startDate);
    const end = parseDate(query.endDate);
    if (start || end) {
      where.incidentDate = {
        ...(start ? { gte: start } : {}),
        ...(end ? { lte: end } : {}),
      };
    }

    // Full-text search across title, summary, officialCause
    if (query.q) {
      const q = query.q.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { officialCause: { contains: q, mode: 'insensitive' } },
      ];
    }

    // --- orderBy ------------------------------------------------------------
    const sortBy = ALLOWED_SORT_COLUMNS.has(query.sortBy ?? '')
      ? query.sortBy!
      : 'incidentDate';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    // --- execute ------------------------------------------------------------
    const [data, total] = await Promise.all([
      this.prisma.incident.findMany({
        where,
        include: listInclude,
        orderBy: { [sortBy]: sortOrder },
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

  // ── Find By Slug ──────────────────────────────────────────────────────────

  async getIncidentBySlug(slug: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { slug },
      include: detailInclude,
    });

    if (!incident) {
      throw new NotFoundException(`Incident with slug '${slug}' not found`);
    }

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

    return incident;
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

    if (dto.airlineId) {
      const airline = await this.prisma.airline.findUnique({
        where: { id: dto.airlineId },
      });
      if (!airline) {
        throw new BadRequestException(
          `Airline with id '${dto.airlineId}' not found`,
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

    const { tagIds, ...data } = dto;

    // Handle tag reassignment: disconnect all, then connect new set
    const tagUpdate =
      tagIds !== undefined
        ? {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
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
        ...(tagUpdate ? { tags: tagUpdate } : {}),
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
