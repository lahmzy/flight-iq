import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

import { IsPublic } from 'src/auth/auth.decorator';
import { IncidentService } from './incident.service';
import { GetIncidentsQueryDto, IncidentSummaryDto } from './incident.dto';

@Controller('incidents')
@IsPublic()
@UseInterceptors(CacheInterceptor)
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  @CacheTTL(60 * 60 * 1000)
  async getAllIncidents(@Query() query: GetIncidentsQueryDto) {
    return this.incidentService.getAllIncidents(query);
  }

  @Get(':id')
  @CacheTTL(60 * 60 * 1000)
  async getIncidentById(@Param('id') id: string): Promise<IncidentSummaryDto> {
    return this.incidentService.getIncidentById(id);
  }
}
