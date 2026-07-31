"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { GlassCard } from "@/components/ui/GlassCard"
import { FadeIn } from "@/components/ui/FadeIn"
import { SectionLabel } from "@/components/ui/SectionLabel"
import type { BackendAircraftTypeStat } from "@/types/incident"

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

export function AircraftCharts({ aircraftTypes }: { aircraftTypes: BackendAircraftTypeStat[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <FadeIn>
        <GlassCard hover={false}>
          <SectionLabel eyebrow="Fleet comparison" title="Incidents by Aircraft Type" />
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aircraftTypes} layout="vertical" barSize={16}>
                <CartesianGrid {...GRID} />
                <XAxis type="number" stroke="#1E293B" tick={TICK} />
                <YAxis dataKey="type" type="category" stroke="#1E293B" tick={TICK} width={150} />
                <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: "rgba(59,130,246,0.05)" }} />
                <Bar dataKey="incidents" name="Incidents" fill="#3B82F6" radius={[0, 6, 6, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </FadeIn>

      <FadeIn>
        <GlassCard hover={false}>
          <SectionLabel eyebrow="Fleet fatality index" title="Fatal Events by Type" />
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aircraftTypes} layout="vertical" barSize={16}>
                <CartesianGrid {...GRID} />
                <XAxis type="number" stroke="#1E293B" tick={TICK} />
                <YAxis dataKey="type" type="category" stroke="#1E293B" tick={TICK} width={150} />
                <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: "rgba(239,68,68,0.04)" }} />
                <Bar dataKey="fatal" name="Fatal Events" fill="#EF4444" radius={[0, 6, 6, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  )
}
