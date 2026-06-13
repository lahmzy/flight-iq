import Link from "next/link"
import { ChevronRight, Plane } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import type { Incident } from "@/lib/landing-data"

export function AircraftInfo({ incident }: { incident: Incident }) {
  const rows = [
    ["Type", incident.aircraft],
    ["Registration", incident.registration],
    ["Operator", incident.airline],
    ["Flight", incident.flightNumber],
  ]

  return (
    <GlassCard hover={false}>
      <div className="mb-5 flex items-center gap-2">
        <Plane size={15} style={{ color: "#3B82F6" }} />
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "#E2E8F0",
          }}
        >
          Aircraft
        </span>
      </div>
      <div className="space-y-3">
        {rows.map(([label, val]) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <span
              className="mono flex-shrink-0"
              style={{ color: "#475569", fontSize: "0.72rem" }}
            >
              {label}
            </span>
            <span
              className="mono text-right"
              style={{ color: "#E2E8F0", fontSize: "0.78rem", fontWeight: 600 }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
      <Link
        href={`/aircraft/${incident.aircraft.replace(/\s+/g, "-").toLowerCase()}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 transition-all hover:border-blue-500/40"
        style={{
          background: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.18)",
          color: "#3B82F6",
          fontSize: "0.8125rem",
          fontWeight: 500,
        }}
      >
        Aircraft Detail Page <ChevronRight size={14} />
      </Link>
    </GlassCard>
  )
}
