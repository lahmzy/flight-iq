import { Plane } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import type { Incident } from "@/lib/landing-data"

export function FlightRoute({ incident }: { incident: Incident }) {
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
            {incident.flightNumber} Departure
          </div>
        </div>
        <div className="relative mx-4 flex-1">
          <div
            className="h-px"
            style={{
              background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
          >
            <Plane
              size={14}
              style={{ color: "#3B82F6", transform: "rotate(45deg)" }}
            />
          </div>
          <div
            className="mono absolute top-1/2 -translate-y-1/2 rounded px-2 py-0.5"
            style={{
              right: "25%",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#EF4444",
              fontSize: "0.62rem",
              transform: "translateY(-200%)",
            }}
          >
            ✕ EMERGENCY
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
            Original Destination
          </div>
        </div>
      </div>
      <div
        className="mono mt-6 rounded-xl p-4"
        style={{
          background: "rgba(249,115,22,0.06)",
          border: "1px solid rgba(249,115,22,0.15)",
          color: "#F97316",
          fontSize: "0.72rem",
        }}
      >
        ⚡ DIVERTED TO KDEN (Denver International) following engine failure
      </div>
    </GlassCard>
  )
}
