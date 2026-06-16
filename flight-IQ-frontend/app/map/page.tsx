"use client"

import { useMemo, useState } from "react"

import Link from "next/link"

import {
  ChevronRight,
  Filter,
  MapPin,
  Plane,
  Search,
  X,
} from "lucide-react"

import { WorldSVGMap } from "@/components/map/WorldSVGMap"
import { SeverityBadge, StatusBadge } from "@/components/ui/SeverityBadge"
import { incidents } from "@/lib/landing-data"
import type { Incident, Severity } from "@/lib/landing-data"

const severityColors: Record<Severity, string> = {
  Fatal: "#EF4444",
  Major: "#F97316",
  Moderate: "#F59E0B",
  Minor: "#10B981",
}

export default function InteractiveMapPage() {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [severityFilter, setSeverityFilter] = useState<Severity[]>([])
  const [heatmap, setHeatmap] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const filtered = useMemo(
    () =>
      incidents.filter((inc) => {
        const q = query.toLowerCase()
        const matchQ =
          !q ||
          inc.title.toLowerCase().includes(q) ||
          inc.location.toLowerCase().includes(q) ||
          inc.aircraft.toLowerCase().includes(q)
        const matchSev =
          !severityFilter.length || severityFilter.includes(inc.severity)
        return matchQ && matchSev
      }),
    [query, severityFilter],
  )

  const selectedIncident = filtered.find((i) => i.id === selectedId)

  const toggleSeverity = (s: Severity) => {
    setSeverityFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {sidebarOpen && (
        <aside
          className="flex-shrink-0 w-80 flex flex-col h-full overflow-y-auto"
          style={{
            background: "rgba(5,8,22,0.95)",
            borderRight: "1px solid rgba(59,130,246,0.08)",
          }}
        >
          <div
            className="p-5 border-b"
            style={{ borderColor: "rgba(59,130,246,0.08)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "#E2E8F0",
                }}
              >
                Incident Map
              </p>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{ color: "#475569" }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#475569" }}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search incidents, locations…"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(59,130,246,0.12)",
                  color: "#E2E8F0",
                  fontSize: "0.8125rem",
                  outline: "none",
                }}
              />
            </div>

            <div className="mb-4">
              <p
                className="mono mb-2"
                style={{
                  color: "#475569",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Filter by Severity
              </p>
              <div className="flex flex-wrap gap-2">
                {(["Fatal", "Major", "Moderate", "Minor"] as Severity[]).map((s) => {
                  const active = severityFilter.includes(s)
                  const color = severityColors[s]
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSeverity(s)}
                      className="px-2.5 py-1 rounded-lg mono transition-all"
                      style={{
                        background: active ? `${color}18` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${active ? color + "40" : "rgba(255,255,255,0.06)"}`,
                        color: active ? color : "#475569",
                        fontSize: "0.68rem",
                      }}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p
                className="mono mb-2"
                style={{
                  color: "#475569",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                View Mode
              </p>
              <div className="flex gap-2">
                {[
                  {
                    label: "Markers",
                    active: !heatmap,
                    onClick: () => setHeatmap(false),
                  },
                  {
                    label: "Heatmap",
                    active: heatmap,
                    onClick: () => setHeatmap(true),
                  },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.onClick}
                    className="flex-1 py-2 rounded-lg mono transition-all"
                    style={{
                      background: btn.active
                        ? "rgba(59,130,246,0.15)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${btn.active ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.06)"}`,
                      color: btn.active ? "#3B82F6" : "#475569",
                      fontSize: "0.72rem",
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <p
              className="mono px-2 pt-1 pb-2"
              style={{
                color: "#475569",
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
              }}
            >
              {filtered.length} INCIDENTS
            </p>
            {filtered.map((inc) => {
              const color = severityColors[inc.severity]
              const isSelected = selectedId === inc.id
              return (
                <div
                  key={inc.id}
                  onClick={() =>
                    setSelectedId(isSelected ? null : inc.id)
                  }
                  className="p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: isSelected
                      ? "rgba(59,130,246,0.1)"
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${
                      isSelected
                        ? "rgba(59,130,246,0.3)"
                        : "rgba(255,255,255,0.04)"
                    }`,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{
                        background: color,
                        boxShadow: `0 0 6px ${color}`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="transition-colors"
                        style={{
                          color: isSelected ? "#93C5FD" : "#CBD5E1",
                          fontSize: "0.8125rem",
                          fontWeight: 500,
                          lineHeight: 1.4,
                        }}
                      >
                        {inc.title}
                      </p>
                      <p
                        className="mono mt-0.5"
                        style={{
                          color: "#475569",
                          fontSize: "0.65rem",
                        }}
                      >
                        {inc.location} ·{" "}
                        {new Date(inc.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className="p-4 border-t"
            style={{ borderColor: "rgba(59,130,246,0.08)" }}
          >
            <div className="grid grid-cols-4 gap-2 text-center">
              {(["Fatal", "Major", "Moderate", "Minor"] as Severity[]).map((s) => {
                const count = filtered.filter((i) => i.severity === s).length
                return (
                  <div key={s}>
                    <div
                      className="mono"
                      style={{
                        color: severityColors[s],
                        fontSize: "1rem",
                        fontWeight: 700,
                      }}
                    >
                      {count}
                    </div>
                    <div
                      className="mono"
                      style={{ color: "#334155", fontSize: "0.58rem" }}
                    >
                      {s}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      )}

      <div className="flex-1 relative overflow-hidden">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-5 left-5 z-30 flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all hover:border-blue-500/30"
            style={{
              background: "rgba(10,16,37,0.9)",
              border: "1px solid rgba(59,130,246,0.14)",
              color: "#94A3B8",
              backdropFilter: "blur(20px)",
            }}
          >
            <Filter size={14} />
            <span style={{ fontSize: "0.8125rem" }}>Filters</span>
          </button>
        )}

        <WorldSVGMap
          items={filtered}
          selected={selectedId}
          onSelect={setSelectedId}
          heatmap={heatmap}
        />

        {selectedIncident && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-30">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(10,16,37,0.95)",
                border: "1px solid rgba(59,130,246,0.25)",
                backdropFilter: "blur(24px)",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(59,130,246,0.1)",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap gap-2">
                  <SeverityBadge severity={selectedIncident.severity} />
                  <StatusBadge status={selectedIncident.status} />
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  style={{ color: "#475569" }}
                >
                  <X size={15} />
                </button>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#E2E8F0",
                  marginBottom: "0.5rem",
                }}
              >
                {selectedIncident.title}
              </h3>
              <div className="flex gap-5 mb-4">
                <div
                  className="flex items-center gap-1.5 mono"
                  style={{ color: "#64748B", fontSize: "0.72rem" }}
                >
                  <Plane size={11} /> {selectedIncident.aircraft}
                </div>
                <div
                  className="flex items-center gap-1.5 mono"
                  style={{ color: "#64748B", fontSize: "0.72rem" }}
                >
                  <MapPin size={11} /> {selectedIncident.location}
                </div>
              </div>
              <Link
                href={`/investigations/${selectedIncident.id}`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                style={{
                  background: "#3B82F6",
                  color: "#fff",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                View Full Investigation <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        )}

        <div
          className="absolute top-5 right-5 z-30 p-4 rounded-xl"
          style={{
            background: "rgba(10,16,37,0.9)",
            border: "1px solid rgba(59,130,246,0.12)",
            backdropFilter: "blur(16px)",
          }}
        >
          <p
            className="mono mb-3"
            style={{
              color: "#475569",
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Legend
          </p>
          {(["Fatal", "Major", "Moderate", "Minor"] as Severity[]).map((s) => (
            <div key={s} className="flex items-center gap-2 mb-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: severityColors[s],
                  boxShadow: `0 0 6px ${severityColors[s]}`,
                }}
              />
              <span className="mono" style={{ color: "#64748B", fontSize: "0.68rem" }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <div
          className="absolute bottom-5 right-5 z-30 mono px-3 py-2 rounded-lg"
          style={{
            background: "rgba(10,16,37,0.9)",
            border: "1px solid rgba(59,130,246,0.1)",
            color: "#475569",
            fontSize: "0.72rem",
            backdropFilter: "blur(16px)",
          }}
        >
          {filtered.length} incidents plotted
        </div>
      </div>
    </div>
  )
}
