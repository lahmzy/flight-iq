"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { GlassCard } from "@/components/ui/GlassCard"
import { FadeIn } from "@/components/ui/FadeIn"
import { SectionLabel } from "@/components/ui/SectionLabel"

const PHASE_COLORS = ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EC4899"]

const phaseData = [
  { phase: "Cruise", value: 31 },
  { phase: "Approach", value: 24 },
  { phase: "Landing", value: 19 },
  { phase: "Takeoff", value: 14 },
  { phase: "Taxi", value: 7 },
  { phase: "Standing", value: 5 },
]

const CHART_TOOLTIP = {
  background: "rgba(10,16,37,0.97)",
  border: "1px solid rgba(59,130,246,0.2)",
  borderRadius: "10px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "0.72rem",
  color: "#94A3B8",
}

export function PhaseBreakdown() {
  return (
    <FadeIn>
      <GlassCard hover={false}>
        <SectionLabel eyebrow="Flight phase" title="Phase Breakdown" />
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={phaseData}
                dataKey="value"
                nameKey="phase"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                strokeWidth={0}
              >
                {phaseData.map((_, i) => (
                  <Cell key={i} fill={PHASE_COLORS[i % PHASE_COLORS.length]} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {phaseData.map((p, i) => (
              <div key={p.phase} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: PHASE_COLORS[i] }}
                />
                <span className="mono" style={{ color: "#64748B", fontSize: "0.65rem" }}>
                  {p.phase} ({p.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </FadeIn>
  )
}
