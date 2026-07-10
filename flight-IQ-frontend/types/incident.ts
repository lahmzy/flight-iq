import type { PaginatedResponse } from "@/types/api"

export type BackendSeverity = "Fatal" | "Major" | "Moderate" | "Minor"

export type FindingCategory =
  | "Personnel"
  | "Environmental"
  | "Aircraft"
  | "Organization"
  | "Other"

export type BackendInvestigationStatus =
  | "UnderInvestigation"
  | "PreliminaryReport"
  | "FinalReport"
  | "Closed"

export interface BackendAircraft {
  id: string
  registrationNo?: string | null
  make?: string | null
  model?: string | null
  series?: string | null
  flightPhase?: string | null
  flightNumber?: string | null
  operatorName?: string | null
  imageUrl?: string | null
}

export interface BackendIncidentAircraft {
  aircraftId: string
  incidentId: string
  isPrimary: boolean
  role?: string | null
  aircraft: BackendAircraft
}

export interface BackendIncidentCount {
  tags?: number
  comments?: number
}

export interface BackendTag {
  tagId: string
  tag: { id: string; name: string; slug: string }
}

/** Lightweight marker shape returned by GET /incidents/map */
export interface BackendMapMarker {
  id: string
  slug: string
  title?: string | null
  severity: BackendSeverity
  evType?: "Accident" | "Incident" | null
  incidentDate: string
  latitude: number
  longitude: number
  fatalities: number
  city?: string | null
  country?: string | null
}

export interface BackendIncident {
  id: string
  ntsbEventId?: string | null
  ntsbNo?: string | null
  slug: string
  title?: string | null
  evType?: "Accident" | "Incident" | null
  severity: BackendSeverity
  status: BackendInvestigationStatus
  incidentDate: string
  city?: string | null
  state?: string | null
  country?: string | null
  aptName?: string | null
  latitude?: number | null
  longitude?: number | null
  departureAirport?: string | null
  destinationAirport?: string | null
  fatalities: number
  injuries: number
  occupants?: number | null
  officialCause?: string | null
  summary?: string | null
  aiLessonsLearned?: string | null
  aircraft: BackendIncidentAircraft[]
  tags?: BackendTag[]
  _count?: BackendIncidentCount
}

export type BackendIncidentList = PaginatedResponse<BackendIncident>
