"use client"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { GlassCard } from "@/components/ui/GlassCard"
import { FadeIn } from "@/components/ui/FadeIn"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { annualStats } from "@/lib/landing-data"

const CHART_TOOLTIP = {
  background: "rgba(10,16,37,0.97)",
  border: "1px solid rgba(59,130,246,0.2)",
  borderRadius: "10px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "0.72rem",
  color: "#94A3B8",
}

const GRID = { stroke: "rgba(255,255,255,0.04)", strokeDasharray: "3 3" }

const TICK = { fill: "#475569", fontFamily: "JetBrains Mono", fontSize: 11 }

export function SafetyTrendLine() {
  return (
    <FadeIn>
      <GlassCard hover={false} className="mb-6">
        <SectionLabel
          eyebrow="Long-term trajectory"
          title="Global Safety Trend 2019–2026"
          subtitle="Total commercial aviation incidents and fatalities over the past 8 years, showing sustained improvement in non-fatal outcomes"
        />
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={annualStats}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="year" stroke="#1E293B" tick={TICK} />
              <YAxis yAxisId="left" stroke="#1E293B" tick={TICK} />
              <YAxis yAxisId="right" orientation="right" stroke="#1E293B" tick={TICK} />
              <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ stroke: "rgba(59,130,246,0.15)" }} />
              <Legend
                wrapperStyle={{
                  fontFamily: "JetBrains Mono",
                  fontSize: "0.68rem",
                  color: "#475569",
                  paddingTop: "1rem",
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="total"
                name="Total Incidents"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="fatal"
                name="Fatal Events"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: "#EF4444", r: 4 }}
                strokeDasharray="5 3"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="injuries"
                name="Injuries"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: "#F59E0B", r: 4 }}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </FadeIn>
  )
}
