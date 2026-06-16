"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

const monthlyData = [
  { month: "Jan", incidents: 38, fatalities: 1 },
  { month: "Feb", incidents: 34, fatalities: 0 },
  { month: "Mar", incidents: 41, fatalities: 2 },
  { month: "Apr", incidents: 45, fatalities: 0 },
  { month: "May", incidents: 42, fatalities: 1 },
  { month: "Jun", incidents: 31, fatalities: 0 },
  { month: "Jul", incidents: 58, fatalities: 3 },
  { month: "Aug", incidents: 62, fatalities: 1 },
  { month: "Sep", incidents: 49, fatalities: 0 },
  { month: "Oct", incidents: 44, fatalities: 2 },
  { month: "Nov", incidents: 37, fatalities: 0 },
  { month: "Dec", incidents: 47, fatalities: 1 },
]

type Period = "2024" | "2025" | "2026"

const periodAnnual: Record<Period, typeof annualStats> = {
  "2024": annualStats.slice(0, 5),
  "2025": annualStats.slice(1, 6),
  "2026": annualStats.slice(2, 7),
}

interface AnnualTrendChartProps {
  period: Period
}

export function AnnualTrendChart({ period }: AnnualTrendChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
      <FadeIn className="lg:col-span-3">
        <GlassCard hover={false}>
          <SectionLabel eyebrow="Year over year" title="Annual Incident Volume" />
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={periodAnnual[period]} barGap={4}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="year" stroke="#1E293B" tick={TICK} />
                <YAxis stroke="#1E293B" tick={TICK} />
                <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: "rgba(59,130,246,0.05)" }} />
                <Legend
                  wrapperStyle={{
                    fontFamily: "JetBrains Mono",
                    fontSize: "0.68rem",
                    color: "#475569",
                    paddingTop: "1rem",
                  }}
                />
                <Bar dataKey="total" name="Total" fill="#3B82F6" radius={[6, 6, 0, 0]} opacity={0.85} />
                <Bar dataKey="fatal" name="Fatal Events" fill="#EF4444" radius={[6, 6, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </FadeIn>

      <FadeIn className="lg:col-span-2">
        <GlassCard hover={false}>
          <SectionLabel eyebrow="2025 seasonality" title="Monthly Distribution" />
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="month" stroke="#1E293B" tick={TICK} />
                <YAxis stroke="#1E293B" tick={TICK} />
                <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ stroke: "rgba(59,130,246,0.15)" }} />
                <Area
                  type="monotone"
                  dataKey="incidents"
                  name="Incidents"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#monthGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  )
}
