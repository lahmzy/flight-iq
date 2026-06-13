import { Users } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import type { Incident } from "@/lib/landing-data"

export function CasualtiesCard({ incident }: { incident: Incident }) {
  const stats = [
    { val: incident.occupants, label: "On Board", color: "#94A3B8" },
    { val: incident.injuries, label: "Injured", color: "#F59E0B" },
    {
      val: incident.fatalities,
      label: "Fatal",
      color: incident.fatalities > 0 ? "#EF4444" : "#10B981",
    },
  ]

  return (
    <GlassCard hover={false}>
      <div className="mb-5 flex items-center gap-2">
        <Users size={15} style={{ color: "#3B82F6" }} />
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "#E2E8F0",
          }}
        >
          Casualties
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div
              className="mono"
              style={{
                color: s.color,
                fontSize: "1.25rem",
                fontWeight: 700,
              }}
            >
              {s.val}
            </div>
            <div
              className="mono mt-0.5"
              style={{ color: "#475569", fontSize: "0.62rem" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
