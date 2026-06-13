"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, X } from "lucide-react"

import { FilterSidebar } from "@/components/investigations/FilterSidebar"
import { InvestigationCard } from "@/components/investigations/InvestigationCard"
import { Pagination } from "@/components/investigations/Pagination"
import { GlassCard } from "@/components/ui/GlassCard"
import type { Cause, Severity, Status } from "@/lib/landing-data"
import { incidents } from "@/lib/landing-data"

const PER_PAGE = 6

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export default function InvestigationsPage() {
  const searchParams = useSearchParams()
  const initialQ = searchParams.get("q") ?? ""
  const initialCause = searchParams.get("cause") ?? ""

  const [query, setQuery] = useState(initialQ)
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([])
  const [selectedCauses, setSelectedCauses] = useState<Cause[]>(
    initialCause ? [initialCause as Cause] : [],
  )
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      const q = query.toLowerCase()
      const matchQ =
        !q ||
        inc.title.toLowerCase().includes(q) ||
        inc.aircraft.toLowerCase().includes(q) ||
        inc.location.toLowerCase().includes(q) ||
        inc.airline.toLowerCase().includes(q) ||
        inc.country.toLowerCase().includes(q) ||
        inc.flightNumber.toLowerCase().includes(q) ||
        inc.registration.toLowerCase().includes(q)

      const matchSev =
        !selectedSeverities.length || selectedSeverities.includes(inc.severity)
      const matchStat =
        !selectedStatuses.length || selectedStatuses.includes(inc.status)
      const matchCause =
        !selectedCauses.length ||
        inc.causes.some((c) => selectedCauses.includes(c))

      return matchQ && matchSev && matchStat && matchCause
    })
  }, [query, selectedSeverities, selectedStatuses, selectedCauses])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggle = <T,>(arr: T[], setArr: (a: T[]) => void, item: T) => {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item])
    setPage(1)
  }

  const clearAll = () => {
    setSelectedSeverities([])
    setSelectedStatuses([])
    setSelectedCauses([])
    setQuery("")
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <motion.div
        className="mb-10"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.p
          variants={fadeUp}
          className="mono mb-2"
          style={{
            color: "#3B82F6",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Investigation Database
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{
            fontFamily: "var(--font-heading)",
            color: "#E2E8F0",
            marginBottom: "0.5rem",
          }}
        >
          All Investigations
        </motion.h1>
        <motion.p
          variants={fadeUp}
          style={{ color: "#64748B", fontSize: "0.9375rem" }}
        >
          {filtered.length} {filtered.length === 1 ? "result" : "results"} ·
          worldwide aviation incident reports
        </motion.p>
      </motion.div>

      <div className="flex items-start gap-8">
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <FilterSidebar
              selectedSeverities={selectedSeverities}
              selectedStatuses={selectedStatuses}
              selectedCauses={selectedCauses}
              onToggleSeverity={(s) =>
                toggle(selectedSeverities, setSelectedSeverities, s)
              }
              onToggleStatus={(s) =>
                toggle(selectedStatuses, setSelectedStatuses, s)
              }
              onToggleCause={(c) =>
                toggle(selectedCauses, setSelectedCauses, c)
              }
              onClearAll={clearAll}
            />
          </motion.div>
        )}

        <div className="min-w-0 flex-1">
          <div className="relative mb-6">
            <Search
              size={16}
              className="absolute top-1/2 left-4 -translate-y-1/2"
              style={{ color: "#475569" }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search by aircraft, airline, location, registration…"
              className="w-full rounded-xl py-3.5 pr-12 pl-11 transition-all focus:shadow-[0_0_30px_rgba(59,130,246,0.12)]"
              style={{
                background: "rgba(10,16,37,0.8)",
                border: "1px solid rgba(59,130,246,0.14)",
                color: "#E2E8F0",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("")
                  setPage(1)
                }}
                className="absolute top-1/2 right-4 -translate-y-1/2"
                style={{ color: "#475569" }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="mb-5 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-slate-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#64748B",
                fontSize: "0.8125rem",
              }}
            >
              <SlidersHorizontal size={14} />
              {sidebarOpen ? "Hide" : "Show"} Filters
            </button>
            <span
              className="mono"
              style={{ color: "#475569", fontSize: "0.72rem" }}
            >
              Showing {(page - 1) * PER_PAGE + 1}–
              {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
          </div>

          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={stagger}
            key={page + query + selectedSeverities.join(",") + selectedStatuses.join(",") + selectedCauses.join(",")}
          >
            {paged.length === 0 ? (
              <GlassCard hover={false} className="py-16 text-center">
                <p style={{ color: "#64748B" }}>
                  No investigations match your filters.
                </p>
                <button
                  onClick={clearAll}
                  className="mono mt-4 text-blue-400 transition-colors hover:text-blue-300"
                  style={{ fontSize: "0.8rem" }}
                >
                  Clear all filters
                </button>
              </GlassCard>
            ) : (
              paged.map((inc) => (
                <motion.div key={inc.id} variants={fadeUp}>
                  <InvestigationCard incident={inc} />
                </motion.div>
              ))
            )}
          </motion.div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
