import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

import { IsPublic } from 'src/auth/auth.decorator';
import { IncidentService } from './incident.service';
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  GetIncidentsQueryDto,
} from './incident.dto';

@Controller('incidents')
@IsPublic()
@UseInterceptors(CacheInterceptor)
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  // ── Create ──────────────────────────────────────────────────────────────
  @Post()
  async create(@Body() dto: CreateIncidentDto) {
    return this.incidentService.createIncident(dto);
  }

  // ── List (paginated, filtered, searchable) ──────────────────────────────
  @Get()
  @CacheTTL(5 * 60 * 1000) // 5 minutes
  async findAll(@Query() query: GetIncidentsQueryDto) {
    return this.incidentService.getAllIncidents(query);
  }

  // ── Detail by slug ──────────────────────────────────────────────────────
  @Get(':slug')
  @CacheTTL(5 * 60 * 1000)
  async findOne(@Param('slug') slug: string) {
    return this.incidentService.getIncidentBySlug(slug);
  }

  // ── Update ──────────────────────────────────────────────────────────────
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateIncidentDto,
  ) {
    return this.incidentService.updateIncident(id, dto);
  }

  // ── Delete ──────────────────────────────────────────────────────────────
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.incidentService.deleteIncident(id);
  }
}
