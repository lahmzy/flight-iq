"use client"

import { useState } from "react"

import { FadeIn } from "@/components/ui/FadeIn"
import { AircraftCharts } from "@/components/statistics/AircraftCharts"
import { AnnualTrendChart } from "@/components/statistics/AnnualTrendChart"
import { CauseAnalysis } from "@/components/statistics/CauseAnalysis"
import { CauseSeverityRadar } from "@/components/statistics/CauseSeverityRadar"
import { InsightCallouts } from "@/components/statistics/InsightCallouts"
import { KpiCards } from "@/components/statistics/KpiCards"
import { PhaseBreakdown } from "@/components/statistics/PhaseBreakdown"
import { RegionBreakdown } from "@/components/statistics/RegionBreakdown"
import { SafetyTrendLine } from "@/components/statistics/SafetyTrendLine"

type Period = "2024" | "2025" | "2026"

export default function StatisticsPage() {
  const [period, setPeriod] = useState<Period>("2025")

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p
              className="mono mb-2"
              style={{
                color: "#3B82F6",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Analytics
            </p>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                color: "#F1F5F9",
                fontSize: "2.5rem",
              }}
            >
              Safety Statistics
            </h1>
            <p style={{ color: "#64748B", fontSize: "0.9375rem", marginTop: "0.375rem" }}>
              Global aviation incident data — NTSB, AAIB, ATSB, BEA, ICAO
            </p>
          </div>

          <div
            className="flex rounded-xl overflow-hidden"
            style={{
              border: "1px solid rgba(59,130,246,0.15)",
              background: "rgba(10,16,37,0.8)",
            }}
          >
            {(["2024", "2025", "2026"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-5 py-2.5 mono transition-all"
                style={{
                  background: period === p ? "rgba(59,130,246,0.2)" : "transparent",
                  color: period === p ? "#3B82F6" : "#475569",
                  fontSize: "0.75rem",
                  fontWeight: period === p ? 700 : 400,
                  borderRight:
                    p !== "2026" ? "1px solid rgba(59,130,246,0.1)" : "none",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      <KpiCards />

      <AnnualTrendChart period={period} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <CauseAnalysis />
        <PhaseBreakdown />
        <CauseSeverityRadar />
      </div>

      <AircraftCharts />

      <RegionBreakdown />

      <SafetyTrendLine />

      <InsightCallouts />
    </div>
  )
}
