import { AlertTriangle } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"

const contributingFactors = [
  {
    factor: "Turbine Blade Fatigue Fracture",
    category: "Primary",
    description:
      "Metallurgical examination of recovered engine debris identified a high-cycle fatigue fracture in the 3rd-stage high pressure turbine blade, originating from a coating delamination zone.",
    severity: "high" as const,
  },
  {
    factor: "Accelerated Inspection Interval",
    category: "Contributing",
    description:
      "The operator had received a supplemental type certificate amendment extending the inspection interval from 2,000 to 3,500 cycles for this blade part number. The fracture occurred at 3,219 cycles.",
    severity: "medium" as const,
  },
  {
    factor: "Inspection Technique Adequacy",
    category: "Contributing",
    description:
      "Fluorescent penetrant inspection may not reliably detect sub-surface fatigue cracks in the blade root attachment area under current inspection procedures.",
    severity: "medium" as const,
  },
  {
    factor: "Crew Resource Management",
    category: "Positive",
    description:
      "The crew demonstrated excellent CRM throughout the emergency. The captain correctly prioritized aviate-navigate-communicate and executed the engine failure checklist without error.",
    severity: "low" as const,
  },
]

function factorColors(severity: "high" | "medium" | "low") {
  if (severity === "high")
    return { color: "#EF4444", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.15)", badgeBg: "rgba(239,68,68,0.15)" }
  if (severity === "medium")
    return { color: "#F59E0B", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.15)", badgeBg: "rgba(245,158,11,0.15)" }
  return { color: "#10B981", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.15)", badgeBg: "rgba(16,185,129,0.15)" }
}

export function ContributingFactors() {
  return (
    <GlassCard hover={false}>
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertTriangle size={15} style={{ color: "#EF4444" }} />
        </div>
        <SectionLabel eyebrow="" title="Contributing Factors" />
      </div>
      <div className="space-y-4">
        {contributingFactors.map((factor, i) => {
          const c = factorColors(factor.severity)
          return (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="mono rounded px-2 py-0.5"
                  style={{
                    color: c.color,
                    background: c.badgeBg,
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {factor.category}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: "#E2E8F0",
                  }}
                >
                  {factor.factor}
                </span>
              </div>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                }}
              >
                {factor.description}
              </p>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
