import type { Incident, Status } from "@/lib/landing-data"
import type {
  BackendIncident,
  BackendIncidentAircraft,
  BackendInvestigationStatus,
  BackendMapMarker,
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

/** Title-cases a string: "AMERICAN AIRLINES" → "American Airlines" */
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function incidentTitle(incident: BackendIncident): string {
  // Use stored title if present
  if (incident.title?.trim()) return incident.title.trim()

  // Pull primary aircraft data (it's already on the incident object in list responses)
  const primary =
    incident.aircraft?.find((a) => a.isPrimary) ?? incident.aircraft?.[0]
  const ac = primary?.aircraft

  const operator = ac?.operatorName?.trim()
    ? toTitleCase(ac.operatorName.trim())
    : null
  const flight = ac?.flightNumber?.trim() || null
  const make = ac?.make?.trim() ? toTitleCase(ac.make.trim()) : null
  const model = ac?.model?.trim() ? toTitleCase(ac.model.trim()) : null
  const evType = incident.evType ?? "Accident"
  const location = [incident.city?.trim(), incident.state?.trim()]
    .filter(Boolean)
    .join(", ")

  // "American Airlines 1077 — Accident, Austin, TX"
  if (operator && flight) {
    const base = `${operator} ${flight} — ${evType}`
    return location ? `${base}, ${location}` : base
  }

  // "American Airlines — Accident, Austin, TX"
  if (operator) {
    const base = `${operator} — ${evType}`
    return location ? `${base}, ${location}` : base
  }

  // "Cessna 172 — Accident, Austin, TX"
  if (make) {
    const acftName = model ? `${make} ${model}` : make
    const base = `${acftName} — ${evType}`
    return location ? `${base}, ${location}` : base
  }

  // "Accident — Austin, TX"
  if (location) return `${evType} — ${location}`

  // Last resort: NTSB identifiers
  return (
    incident.ntsbNo?.trim() ||
    incident.ntsbEventId?.trim() ||
    "Untitled NTSB incident"
  )
}


export function formatStatus(status: BackendInvestigationStatus): Status {
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

/** Map a lightweight map marker to the display Incident shape used by the map page. */
export function mapBackendMarkerToDisplay(marker: BackendMapMarker): Incident {
  const aircraft = marker.aircraft?.[0]?.aircraft
  const makeModel = compact([aircraft?.make, aircraft?.model])
  const city = [marker.city, marker.country].filter(Boolean).join(", ")

  return {
    id: marker.slug,
    title:
      marker.title?.trim() ||
      (makeModel.length > 0
        ? `${makeModel.join(" ")} — ${marker.evType ?? "Accident"}, ${city}`
        : `${marker.evType ?? "Accident"} — ${city}`),
    date: marker.incidentDate,
    location: city || "Location unavailable",
    country: marker.country?.trim() || "Unknown",
    aircraft: makeModel.join(" ") || "Unknown aircraft",
    registration: aircraft?.registrationNo?.trim() || "N/A",
    airline: aircraft?.operatorName?.trim() || "NTSB record",
    flightNumber: "N/A",
    severity: marker.severity,
    status: formatStatus(marker.status),
    causes: marker.evType ? [marker.evType] : ["NTSB"],
    fatalities: marker.fatalities,
    injuries: 0,
    occupants: 0,
    summary: "",
    lat: marker.latitude,
    lng: marker.longitude,
    departureAirport: "N/A",
    destinationAirport: "N/A",
    phase: aircraft?.flightPhase?.trim() || "Unknown",
  }
}
