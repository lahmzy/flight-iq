"use client"

import { Globe } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"
import { SectionLabel } from "@/components/ui/SectionLabel"

const regionData = [
  { region: "North America", incidents: 1456, fatalities: 41 },
  { region: "Europe", incidents: 1234, fatalities: 28 },
  { region: "Asia-Pacific", incidents: 987, fatalities: 67 },
  { region: "South America", incidents: 456, fatalities: 22 },
  { region: "Middle East", incidents: 312, fatalities: 15 },
  { region: "Africa", incidents: 163, fatalities: 31 },
]

export function RegionBreakdown() {
  const maxIncidents = Math.max(...regionData.map((x) => x.incidents))

  return (
    <FadeIn>
      <GlassCard hover={false} className="mb-6">
        <SectionLabel eyebrow="Geographic distribution" title="Incidents by Region" />
        <div className="mt-6 space-y-4">
          <StaggerContainer>
            {regionData.map((r) => {
              const pct = (r.incidents / maxIncidents) * 100
              const fatalRate = ((r.fatalities / r.incidents) * 100).toFixed(1)
              const rateColor =
                parseFloat(fatalRate) > 3
                  ? "#EF4444"
                  : parseFloat(fatalRate) > 2
                    ? "#F59E0B"
                    : "#10B981"
              const rateBg =
                parseFloat(fatalRate) > 3
                  ? "rgba(239,68,68,0.1)"
                  : parseFloat(fatalRate) > 2
                    ? "rgba(245,158,11,0.1)"
                    : "rgba(16,185,129,0.1)"

              return (
                <StaggerItem key={r.region}>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <Globe size={13} style={{ color: "#475569" }} />
                        <span style={{ color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 500 }}>
                          {r.region}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="mono" style={{ color: "#94A3B8", fontSize: "0.72rem" }}>
                          {r.incidents.toLocaleString()} incidents
                        </span>
                        <span className="mono" style={{ color: "#EF4444", fontSize: "0.72rem" }}>
                          {r.fatalities} fatal
                        </span>
                        <span
                          className="mono px-2 py-0.5 rounded"
                          style={{
                            color: rateColor,
                            background: rateBg,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                          }}
                        >
                          {fatalRate}% fatal rate
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                          boxShadow: "0 0 8px rgba(59,130,246,0.4)",
                        }}
                      />
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </GlassCard>
    </FadeIn>
  )
}
