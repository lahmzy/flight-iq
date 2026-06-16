"use client"

import { AlertTriangle, Globe, Shield, TrendingDown, TrendingUp, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn"

interface KpiCardData {
  icon: LucideIcon
  label: string
  value: string
  delta: string
  up: boolean
  color: string
}

const kpiCards: KpiCardData[] = [
  { icon: AlertTriangle, label: "Total Incidents", value: "4,608", delta: "-8.2%", up: false, color: "#F97316" },
  { icon: Shield, label: "Fatal Events", value: "177", delta: "-12.3%", up: false, color: "#EF4444" },
  { icon: Users, label: "Total Fatalities", value: "312", delta: "-18.1%", up: false, color: "#EC4899" },
  { icon: Globe, label: "Countries", value: "178", delta: "+3", up: true, color: "#3B82F6" },
]

export function KpiCards() {
  return (
    <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {kpiCards.map((kpi) => {
        const Icon = kpi.icon
        return (
          <StaggerItem key={kpi.label}>
            <GlassCard hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={14} style={{ color: kpi.color }} />
                <span
                  className="mono"
                  style={{
                    color: "#475569",
                    fontSize: "0.62rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {kpi.label}
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
                {kpi.value}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {kpi.up ? (
                  <TrendingUp size={11} style={{ color: "#10B981" }} />
                ) : (
                  <TrendingDown size={11} style={{ color: "#10B981" }} />
                )}
                <span className="mono" style={{ color: "#10B981", fontSize: "0.65rem" }}>
                  {kpi.delta} vs prior year
                </span>
              </div>
            </GlassCard>
          </StaggerItem>
        )
      })}
    </StaggerContainer>
  )
}
