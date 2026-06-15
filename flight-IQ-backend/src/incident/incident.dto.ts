import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsArray,
  IsUUID,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Severity,
  InvestigationStatus,
  FlightPhase,
} from 'prisma/generated/prisma/enums';

// ─── Create ────────────────────────────────────────────────────────────────────

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsEnum(Severity)
  severity: Severity;

  @IsDateString()
  incidentDate: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @IsUUID()
  aircraftId: string;

  @IsOptional()
  @IsUUID()
  airlineId?: string;

  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsOptional()
  @IsString()
  registration?: string;

  @IsOptional()
  @IsString()
  departureAirport?: string;

  @IsOptional()
  @IsString()
  destinationAirport?: string;

  @IsOptional()
  @IsEnum(FlightPhase)
  phase?: FlightPhase;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  occupants?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  fatalities?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  injuries?: number;

  @IsOptional()
  @IsEnum(InvestigationStatus)
  status?: InvestigationStatus;

  @IsOptional()
  @IsString()
  officialCause?: string;

  @IsOptional()
  @IsString()
  lessonsLearned?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}

// ─── Update ────────────────────────────────────────────────────────────────────

export class UpdateIncidentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @IsOptional()
  @IsDateString()
  incidentDate?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @IsUUID()
  aircraftId?: string;

  @IsOptional()
  @IsUUID()
  airlineId?: string;

  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsOptional()
  @IsString()
  registration?: string;

  @IsOptional()
  @IsString()
  departureAirport?: string;

  @IsOptional()
  @IsString()
  destinationAirport?: string;

  @IsOptional()
  @IsEnum(FlightPhase)
  phase?: FlightPhase;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  occupants?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  fatalities?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  injuries?: number;

  @IsOptional()
  @IsEnum(InvestigationStatus)
  status?: InvestigationStatus;

  @IsOptional()
  @IsString()
  officialCause?: string;

  @IsOptional()
  @IsString()
  lessonsLearned?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}

// ─── Query ─────────────────────────────────────────────────────────────────────

export class GetIncidentsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @IsOptional()
  @IsEnum(InvestigationStatus)
  status?: InvestigationStatus;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsUUID()
  aircraftId?: string;

  @IsOptional()
  @IsUUID()
  airlineId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
