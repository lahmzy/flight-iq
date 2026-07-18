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

// ── Aircraft ──────────────────────────────────────────────────────────────────

export interface BackendAircraftNarrative {
  narrativeAccp?: string | null  // preliminary/accident narrative — most detailed
  narrativeAccf?: string | null  // final accident narrative
  narrativeCause?: string | null // official probable cause statement
  narrativeInc?: string | null   // incident narrative (INC-type events)
}

/** Aircraft shape returned in list queries */
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

/** Aircraft shape returned in detail queries (includes narrative) */
export interface BackendAircraftDetail extends BackendAircraft {
  ntsbCategory?: string | null
  homebuilt?: boolean
  narrative?: BackendAircraftNarrative | null
}

export interface BackendIncidentAircraft {
  aircraftId: string
  incidentId: string
  isPrimary: boolean
  role?: string | null
  aircraft: BackendAircraft
}

/** IncidentAircraft with full aircraft detail (includes narrative) */
export interface BackendIncidentAircraftDetail {
  aircraftId: string
  incidentId: string
  isPrimary: boolean
  role?: string | null
  aircraft: BackendAircraftDetail
}

// ── Supporting types ──────────────────────────────────────────────────────────

export interface BackendIncidentCount {
  tags?: number
  comments?: number
}

export interface BackendTag {
  tagId: string
  tag: { id: string; name: string; slug: string }
}

export interface BackendSource {
  id: string
  title: string
  sourceName: string
  url?: string | null
  publishedDate?: string | null
  isAvailable: boolean
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

// ── Incident shapes ───────────────────────────────────────────────────────────

/** Incident shape returned in list queries */
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

/** Incident shape returned in detail queries — includes narratives and sources */
export interface BackendIncidentDetail extends Omit<BackendIncident, "aircraft"> {
  aircraft: BackendIncidentAircraftDetail[]
  sources: BackendSource[]
  _count: BackendIncidentCount
}

export type BackendIncidentList = PaginatedResponse<BackendIncident>
