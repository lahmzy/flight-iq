import type { Incident, Status } from "@/lib/landing-data"
import type {
  BackendIncident,
  BackendIncidentAircraft,
  BackendInvestigationStatus,
} from "@/types/incident"

function primaryAircraft(
  incident: BackendIncident,
): BackendIncidentAircraft | undefined {
  return (
    incident.aircraft.find((link) => link.isPrimary) ?? incident.aircraft[0]
  )
}

function compact(parts: Array<string | null | undefined>): string[] {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
}

export function formatIncidentLocation(incident: BackendIncident): string {
  const location = compact([incident.aptName, incident.city, incident.state])
  return location.length > 0 ? location.join(", ") : "Location unavailable"
}

export function formatAircraftName(
  aircraft: BackendIncidentAircraft | undefined,
): string {
  if (!aircraft) return "Unknown aircraft"

  const name = compact([
    aircraft.aircraft.make,
    aircraft.aircraft.model,
    aircraft.aircraft.series,
  ])

  return name.length > 0 ? name.join(" ") : "Unknown aircraft"
}

export function incidentTitle(incident: BackendIncident): string {
  return (
    incident.title?.trim() ||
    incident.ntsbNo?.trim() ||
    incident.ntsbEventId?.trim() ||
    "Untitled NTSB incident"
  )
}

function formatStatus(status: BackendInvestigationStatus): Status {
  switch (status) {
    case "UnderInvestigation":
      return "Under Investigation"
    case "PreliminaryReport":
      return "Preliminary Report"
    case "FinalReport":
      return "Final Report"
    case "Closed":
      return "Closed"
    default:
      return "Under Investigation"
  }
}

export function mapBackendIncidentToDisplay(
  incident: BackendIncident,
): Incident {
  const aircraft = primaryAircraft(incident)
  const registration = aircraft?.aircraft.registrationNo?.trim() || "N/A"
  const operator = aircraft?.aircraft.operatorName?.trim() || "NTSB record"
  const phase = aircraft?.aircraft.flightPhase?.trim() || "Unknown"

  return {
    id: incident.slug,
    title: incidentTitle(incident),
    date: incident.incidentDate,
    location: formatIncidentLocation(incident),
    country: incident.country?.trim() || "Unknown",
    aircraft: formatAircraftName(aircraft),
    registration,
    airline: operator,
    flightNumber: aircraft?.aircraft.flightNumber?.trim() || "N/A",
    severity: incident.severity,
    status: formatStatus(incident.status),
    causes: incident.evType ? [incident.evType] : ["NTSB"],
    fatalities: incident.fatalities,
    injuries: incident.injuries,
    occupants: incident.occupants ?? 0,
    summary:
      incident.summary?.trim() ||
      incident.officialCause?.trim() ||
      "No narrative summary is available for this record yet.",
    lat: incident.latitude ?? 0,
    lng: incident.longitude ?? 0,
    departureAirport: incident.departureAirport?.trim() || "N/A",
    destinationAirport: incident.destinationAirport?.trim() || "N/A",
    phase,
  }
}

export function hasIncidentCoordinates(incident: Incident): boolean {
  return incident.lat !== 0 || incident.lng !== 0
}
