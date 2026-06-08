import { Injectable, NotFoundException } from '@nestjs/common';

import { GetIncidentsQueryDto, IncidentSummaryDto } from './incident.dto';

/**
 * Placeholder service. Once the `Incident` model is added to
 * `prisma/schema/*.prisma` and migrated, replace the body of
 * these methods with Prisma calls — the controller, cache
 * interceptor, and TTL behavior will not need to change.
 */
@Injectable()
export class IncidentService {
  private readonly seed: IncidentSummaryDto[] = [
    {
      id: 'inc_001',
      title: 'Engine failure on final approach',
      location: 'San Francisco, CA',
      latitude: 37.6213,
      longitude: -122.379,
      occurredOn: '2024-08-12',
    },
    {
      id: 'inc_002',
      title: 'Hard landing — nose gear collapse',
      location: 'Denver, CO',
      latitude: 39.8561,
      longitude: -104.6737,
      occurredOn: '2024-09-03',
    },
  ];

  async getAllIncidents(query: GetIncidentsQueryDto): Promise<{
    data: IncidentSummaryDto[];
    meta: { page: number; limit: number; total: number };
  }> {
    await Promise.resolve();
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const start = (page - 1) * limit;
    const slice = this.seed.slice(start, start + limit);

    return {
      data: slice,
      meta: { page, limit, total: this.seed.length },
    };
  }

  async getIncidentById(id: string): Promise<IncidentSummaryDto> {
    await Promise.resolve();
    const found = this.seed.find((incident) => incident.id === id);
    if (!found) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
    return found;
  }
}
