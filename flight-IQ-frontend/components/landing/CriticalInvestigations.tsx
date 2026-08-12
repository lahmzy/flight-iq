"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight, Loader2 } from "lucide-react"

import {
  CauseBadge,
  SeverityBadge,
  StatusBadge,
} from "@/components/ui/SeverityBadge"
import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { incidents as fallbackIncidents } from "@/lib/landing-data"

import { useGetRequest } from "@/hooks/useGetRequest"
import type { BackendApiResponse } from "@/types/api"
import type { BackendIncidentList } from "@/types/incident"
import { mapBackendIncidentToDisplay } from "@/lib/incident-display"

const headerFade = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const listItem = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function CriticalInvestigations() {
  const { data, isLoading } = useGetRequest<BackendApiResponse<BackendIncidentList>>({
    url: "/incidents?limit=5&sortBy=incidentDate&sortOrder=desc",
    queryKey: ["latest_incidents"],
  })

  const displayIncidents = data?.data?.data
    ? data.data.data.map(mapBackendIncidentToDisplay)
    : fallbackIncidents.slice(0, 5)

  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <motion.div
        className="mb-10 flex items-end justify-between"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headerFade}
      >
        <SectionLabel
          eyebrow="Recent Investigations"
          title="Latest Reports"
          subtitle="Most recently indexed incidents from global aviation authorities"
        />
        <Link
          href="/incident"
          className="hidden items-center gap-1.5 transition-colors hover:text-white md:flex"
          style={{ color: "#3B82F6", fontSize: "0.875rem", fontWeight: 500 }}
        >
          Full database <ChevronRight size={16} />
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={listContainer}
        >
          {displayIncidents.map((inc) => (
            <motion.div key={inc.id} variants={listItem}>
              <Link href={`/incident/${inc.id}`}>
                <GlassCard className="group" padding="p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                    <div className="flex items-start gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className="w-16 sm:w-20 flex-shrink-0 pt-0.5">
                        <div
                          className="mono"
                          style={{
                            color: "#3B82F6",
                            fontSize: "0.7rem",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {new Date(inc.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div
                          className="mono"
                          style={{ color: "#475569", fontSize: "0.65rem" }}
                        >
                          {new Date(inc.date).getFullYear()}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <SeverityBadge severity={inc.severity} />
                          <StatusBadge status={inc.status} />
                          {inc.causes.slice(0, 2).map((c) => (
                            <CauseBadge key={c} cause={c} />
                          ))}
                        </div>
                        <h3
                          className="truncate transition-colors group-hover:text-blue-400"
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontWeight: 600,
                            fontSize: "1.05rem",
                            color: "#E2E8F0",
                          }}
                        >
                          {inc.title}
                        </h3>
                        <p
                          className="mono mt-1.5"
                          style={{ color: "#475569", fontSize: "0.72rem" }}
                        >
                          {inc.aircraft} · {inc.airline} · {inc.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full md:w-auto items-center justify-between md:justify-end border-t border-slate-800/40 pt-3 md:border-t-0 md:pt-0 gap-6 md:flex-shrink-0">
                      <div className="flex items-center gap-6">
                        {inc.fatalities > 0 && (
                          <div className="text-right">
                            <div
                              className="mono"
                              style={{
                                color: "#EF4444",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                              }}
                            >
                              {inc.fatalities}
                            </div>
                            <div
                              className="mono"
                              style={{ color: "#475569", fontSize: "0.65rem" }}
                            >
                              fatalities
                            </div>
                          </div>
                        )}
                        <div className="text-right">
                          <div
                            className="mono"
                            style={{
                              color: "#94A3B8",
                              fontSize: "0.9rem",
                              fontWeight: 600,
                            }}
                          >
                            {inc.occupants}
                          </div>
                          <div
                            className="mono"
                            style={{ color: "#475569", fontSize: "0.65rem" }}
                          >
                            on board
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="transition-all group-hover:translate-x-1"
                        style={{ color: "#475569" }}
                      />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}

