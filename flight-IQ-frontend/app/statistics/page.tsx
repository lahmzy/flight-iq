"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { FadeIn } from "@/components/ui/FadeIn"
import { AircraftCharts } from "@/components/statistics/AircraftCharts"
import { AnnualTrendChart } from "@/components/statistics/AnnualTrendChart"
import { CauseAnalysis } from "@/components/statistics/CauseAnalysis"
import { CauseSeverityRadar } from "@/components/statistics/CauseSeverityRadar"
import { InsightCallouts } from "@/components/statistics/InsightCallouts"
import { KpiCards } from "@/components/statistics/KpiCards"
import { AircraftCategoryBreakdown } from "@/components/statistics/AircraftCategoryBreakdown"
import { RegionBreakdown } from "@/components/statistics/RegionBreakdown"
import { SafetyTrendLine } from "@/components/statistics/SafetyTrendLine"

import { useGetRequest } from "@/hooks/useGetRequest"
import type { BackendApiResponse } from "@/types/api"
import type { BackendStatistics } from "@/types/incident"

export default function StatisticsPage() {
  const router = useRouter()
  const { data, isLoading } = useGetRequest<BackendApiResponse<BackendStatistics>>({
    url: "/incidents/stats",
    queryKey: ["incidents", "stats"],
  })
  const stats = data?.data

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <FadeIn>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg transition-all cursor-pointer text-[0.8125rem] text-[#94A3B8] bg-white/[0.03] border border-[rgba(59,130,246,0.12)] hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400"
        >
          <ArrowLeft size={14} />
          Back
        </button>
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
        </div>
      </FadeIn>

      {isLoading || !stats ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={22} className="animate-spin" style={{ color: "#3B82F6" }} />
        </div>
      ) : (
        <>
          <KpiCards kpi={stats.kpi} />

          <AnnualTrendChart yearly={stats.yearly} monthly={stats.monthly} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <CauseAnalysis causeCategories={stats.causeCategories} />
            <AircraftCategoryBreakdown aircraftCategories={stats.aircraftCategories} />
            <CauseSeverityRadar causeSeverity={stats.causeSeverityRadar} />
          </div>

          <AircraftCharts aircraftTypes={stats.aircraftTypes} />

          <RegionBreakdown regions={stats.regions} />

          <SafetyTrendLine yearly={stats.yearly} />

          <InsightCallouts />
        </>
      )}
    </div>
  )
}
