"use client"

import { AlertTriangle, Globe, Shield, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"
import type { BackendStatsKpi } from "@/types/incident"

interface KpiCardData {
  icon: LucideIcon
  label: string
  value: string
  sub: string
  color: string
}

function buildKpiCards(kpi: BackendStatsKpi): KpiCardData[] {
  return [
    {
      icon: AlertTriangle,
      label: "Total Incidents",
      value: kpi.total.toLocaleString(),
      sub: "All-time NTSB records",
      color: "#F97316",
    },
    {
      icon: Shield,
      label: "Fatal Events",
      value: kpi.fatalEvents.toLocaleString(),
      sub: `${Math.round((kpi.fatalEvents / kpi.total) * 100)}% of incidents`,
      color: "#EF4444",
    },
    {
      icon: Users,
      label: "Total Fatalities",
      value: kpi.totalFatalities.toLocaleString(),
      sub: `${kpi.totalInjuries.toLocaleString()} injuries recorded`,
      color: "#EC4899",
    },
    {
      icon: Globe,
      label: "Countries",
      value: kpi.countries.toLocaleString(),
      sub: "Worldwide coverage",
      color: "#3B82F6",
    },
  ]
}

export function KpiCards({ kpi }: { kpi: BackendStatsKpi }) {
  const kpiCards = buildKpiCards(kpi)

  return (
    <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {kpiCards.map((item) => {
        const Icon = item.icon
        return (
          <StaggerItem key={item.label}>
            <GlassCard hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={14} style={{ color: item.color }} />
                <span
                  className="mono"
                  style={{
                    color: "#475569",
                    fontSize: "0.62rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 700,
                  fontSize: "1.75rem",
                  color: "#E2E8F0",
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
              <div className="mt-2">
                <span className="mono" style={{ color: "#475569", fontSize: "0.65rem" }}>
                  {item.sub}
                </span>
              </div>
            </GlassCard>
          </StaggerItem>
        )
      })}
    </StaggerContainer>
  )
}
