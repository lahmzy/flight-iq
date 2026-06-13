"use client"

import { use } from "react"
import { motion } from "framer-motion"

import { AircraftInfo } from "@/components/investigations/AircraftInfo"
import { CasualtiesCard } from "@/components/investigations/CasualtiesCard"
import { CommentsSection } from "@/components/investigations/CommentsSection"
import { ContributingFactors } from "@/components/investigations/ContributingFactors"
import { EventTimeline } from "@/components/investigations/EventTimeline"
import { FlightRoute } from "@/components/investigations/FlightRoute"
import { IncidentHeader } from "@/components/investigations/IncidentHeader"
import { InvestigationSummary } from "@/components/investigations/InvestigationSummary"
import { LessonsLearned } from "@/components/investigations/LessonsLearned"
import { OfficialReports } from "@/components/investigations/OfficialReports"
import { RelatedIncidents } from "@/components/investigations/RelatedIncidents"
import { RelatedVideos } from "@/components/investigations/RelatedVideos"
import { incidents } from "@/lib/landing-data"

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
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const incident = incidents.find((i) => i.id === id) ?? incidents[0]
  const related = incidents
    .filter(
      (i) =>
        i.id !== incident.id &&
        i.causes.some((c) => incident.causes.includes(c)),
    )
    .slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <IncidentHeader incident={incident} />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <motion.div
          className="space-y-8 xl:col-span-2"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <FlightRoute incident={incident} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <EventTimeline />
          </motion.div>
          <motion.div variants={fadeUp}>
            <InvestigationSummary incident={incident} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <ContributingFactors />
          </motion.div>
          <motion.div variants={fadeUp}>
            <LessonsLearned />
          </motion.div>
          <motion.div variants={fadeUp}>
            <RelatedVideos />
          </motion.div>
          <motion.div variants={fadeUp}>
            <CommentsSection />
          </motion.div>
        </motion.div>

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
            <OfficialReports />
          </motion.div>
          <motion.div variants={fadeUp}>
            <RelatedIncidents incidents={related} />
          </motion.div>
        </motion.aside>
      </div>
    </div>
  )
}
