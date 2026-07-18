"use client"

import { use } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { useGetRequest } from "@/hooks/useGetRequest"
import type { BackendApiResponse } from "@/types/api"
import type { BackendIncidentDetail } from "@/types/incident"

import { AircraftInfo } from "@/components/investigations/AircraftInfo"
import { CasualtiesCard } from "@/components/investigations/CasualtiesCard"
import { FlightRoute } from "@/components/investigations/FlightRoute"
import { IncidentHeader } from "@/components/investigations/IncidentHeader"
import { IncidentDetailSkeleton } from "@/components/investigations/IncidentDetailSkeleton"
import { IncidentMetaCard } from "@/components/investigations/IncidentMetaCard"
import { InvestigationSummary } from "@/components/investigations/InvestigationSummary"
import { RelatedIncidents } from "@/components/investigations/RelatedIncidents"
import { GlassCard } from "@/components/ui/GlassCard"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

export default function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const { data, isLoading, isError } = useGetRequest<
    BackendApiResponse<BackendIncidentDetail>
  >({
    url: `/incidents/${id}`,
    queryKey: ["incident", id],
  })

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) return <IncidentDetailSkeleton />

  // ── Error / not found ──────────────────────────────────────────────────────
  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <Link
          href="/incident"
          className="mb-8 inline-flex items-center gap-2 transition-colors hover:text-white"
          style={{ color: "#64748B", fontSize: "0.875rem" }}
        >
          <ArrowLeft size={15} /> Back to Investigations
        </Link>
        <GlassCard hover={false} className="py-16">
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#E2E8F0",
              marginBottom: "0.75rem",
            }}
          >
            Investigation Not Found
          </p>
          <p style={{ color: "#64748B" }}>
            The incident record{" "}
            <span className="mono" style={{ color: "#94A3B8" }}>
              {id}
            </span>{" "}
            could not be found.
          </p>
        </GlassCard>
      </div>
    )
  }

  const incident = data.data

  // Primary aircraft for narrative access
  const primaryAircraftLink =
    incident.aircraft.find((a) => a.isPrimary) ?? incident.aircraft[0]
  const narrative = primaryAircraftLink?.aircraft.narrative ?? null

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeUp}>
          <IncidentHeader incident={incident} />
        </motion.div>
      </motion.div>

      {/* ── Body grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Main column */}
        <motion.div
          className="space-y-8 xl:col-span-2"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <InvestigationSummary incident={incident} narrative={narrative} />
          </motion.div>

          <motion.div variants={fadeUp}>
            <FlightRoute incident={incident} />
          </motion.div>

          <motion.div variants={fadeUp}>
            <RelatedIncidents
              currentSlug={incident.slug}
              severity={incident.severity}
              country={incident.country}
            />
          </motion.div>
        </motion.div>

        {/* Aside */}
        <motion.aside
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <AircraftInfo incident={incident} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <CasualtiesCard incident={incident} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <IncidentMetaCard incident={incident} />
          </motion.div>
        </motion.aside>
      </div>
    </div>
  )
}
