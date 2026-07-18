import { MapPin, Plane } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import type { BackendIncidentDetail } from "@/types/incident"

// ── Location card (when no route data) ────────────────────────────────────────

function LocationCard({ incident }: { incident: BackendIncidentDetail }) {
  const placeName =
    incident.aptName?.trim() ||
    [incident.city, incident.state, incident.country].filter(Boolean).join(", ") ||
    "Unknown location"

  const hasCoords =
    incident.latitude != null && incident.longitude != null

  return (
    <GlassCard hover={false}>
      <SectionLabel eyebrow="Incident Location" title="Location" />
      <div
        className="mt-6 flex items-start gap-4 rounded-xl p-4"
        style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.12)" }}
      >
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}
        >
          <MapPin size={18} style={{ color: "#3B82F6" }} />
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "1.05rem",
              color: "#E2E8F0",
              lineHeight: 1.3,
            }}
          >
            {placeName}
          </p>
          {hasCoords && (
            <p
              className="mono mt-1.5"
              style={{ color: "#475569", fontSize: "0.72rem" }}
            >
              {incident.latitude!.toFixed(4)}° N, {incident.longitude!.toFixed(4)}° E
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  )
}

// ── Route diagram (when departure + destination are present) ──────────────────

function RouteCard({ incident }: { incident: BackendIncidentDetail }) {
  const primaryAircraft = incident.aircraft.find((a) => a.isPrimary) ?? incident.aircraft[0]
  const flightNumber = primaryAircraft?.aircraft.flightNumber?.trim()

  return (
    <GlassCard hover={false}>
      <SectionLabel eyebrow="Route" title="Flight Route" />
      <div className="mt-6 flex items-center gap-4">
        <div className="text-center">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "2rem",
              color: "#3B82F6",
              lineHeight: 1,
            }}
          >
            {incident.departureAirport}
          </div>
          <div style={{ color: "#64748B", fontSize: "0.8rem", marginTop: "0.25rem" }}>
            {flightNumber ? `${flightNumber} Departure` : "Departure"}
          </div>
        </div>

        <div className="relative mx-4 flex-1">
          <div
            className="h-px"
            style={{ background: "linear-gradient(90deg, #3B82F6, #8B5CF6)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
          >
            <Plane size={14} style={{ color: "#3B82F6", transform: "rotate(45deg)" }} />
          </div>
        </div>

        <div className="text-center">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "2rem",
              color: "#8B5CF6",
              lineHeight: 1,
            }}
          >
            {incident.destinationAirport}
          </div>
          <div style={{ color: "#64748B", fontSize: "0.8rem", marginTop: "0.25rem" }}>
            Destination
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

// ── Public export — picks the right variant ───────────────────────────────────

export function FlightRoute({ incident }: { incident: BackendIncidentDetail }) {
  const hasRoute = !!incident.departureAirport && !!incident.destinationAirport
  return hasRoute ? <RouteCard incident={incident} /> : <LocationCard incident={incident} />
}
