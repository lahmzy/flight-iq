"use client"

import { motion } from "framer-motion"

import { GlassCard } from "@/components/ui/GlassCard"
import { useGetRequest } from "@/hooks/useGetRequest"
import type { BackendApiResponse } from "@/types/api"
import type { BackendIncidentList } from "@/types/incident"

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function StatsBar() {
  const { data } = useGetRequest<BackendApiResponse<BackendIncidentList>>({
    url: "/incidents?limit=1",
    queryKey: ["stats_total"],
  })

  const totalInvestigations = data?.data?.meta?.total
    ? data.data.meta.total.toLocaleString()
    : "..."

  // Create NTSB-aware stats matching the initial plan
  const dynamicStats = [
    { value: totalInvestigations, label: "Total Investigations", sub: "All time" },
    { value: "NTSB", label: "Data Source", sub: "NTSB CSV dataset" },
    { value: "Map", label: "Mapped Incidents", sub: "Incidents with coordinates" },
    { value: "< 48h", label: "Report Indexing", sub: "After NTSB publication" },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <motion.div
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
      >
        {dynamicStats.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <GlassCard hover={false} className="text-center">
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  color: "#E2E8F0",
                  lineHeight: 1.2,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
              <div
                className="mono mt-1"
                style={{
                  color: "#475569",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                }}
              >
                {stat.sub}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

