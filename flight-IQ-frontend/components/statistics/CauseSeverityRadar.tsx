"use client"

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { GlassCard } from "@/components/ui/GlassCard"
import { FadeIn } from "@/components/ui/FadeIn"
import { SectionLabel } from "@/components/ui/SectionLabel"
import type { BackendCauseSeverity } from "@/types/incident"

const CHART_TOOLTIP = {
  background: "rgba(10,16,37,0.97)",
  border: "1px solid rgba(59,130,246,0.2)",
  borderRadius: "10px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "0.72rem",
  color: "#94A3B8",
}

export function CauseSeverityRadar({ causeSeverity }: { causeSeverity: BackendCauseSeverity[] }) {
  return (
    <FadeIn>
      <GlassCard hover={false}>
        <SectionLabel eyebrow="Fatal vs. non-fatal" title="Cause Severity Radar" />
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={causeSeverity}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#475569", fontFamily: "JetBrains Mono", fontSize: 10 }}
              />
              <Radar
                name="Fatal %"
                dataKey="fatal"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.15}
                strokeWidth={1.5}
              />
              <Radar
                name="Non-fatal %"
                dataKey="nonFatal"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.12}
                strokeWidth={1.5}
              />
              <Tooltip contentStyle={CHART_TOOLTIP} />
              <Legend
                wrapperStyle={{
                  fontFamily: "JetBrains Mono",
                  fontSize: "0.68rem",
                  color: "#475569",
                  paddingTop: "0.5rem",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </FadeIn>
  )
}
