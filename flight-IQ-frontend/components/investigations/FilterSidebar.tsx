"use client"

import { SlidersHorizontal } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import type { Cause, Severity, Status } from "@/lib/landing-data"

const SEVERITIES: Severity[] = ["Fatal", "Major", "Moderate", "Minor"]
const STATUSES: Status[] = [
  "Under Investigation",
  "Preliminary Report",
  "Final Report",
  "Closed",
]
const CAUSES: Cause[] = [
  "Pilot Error",
  "Weather",
  "Mechanical Failure",
  "Bird Strike",
  "Fuel Issues",
  "Maintenance",
  "ATC Error",
]

function severityColor(s: Severity) {
  if (s === "Fatal") return "#EF4444"
  if (s === "Major") return "#F97316"
  if (s === "Moderate") return "#F59E0B"
  return "#10B981"
}

function FilterGroup<T extends string>({
  label,
  items,
  selected,
  onToggle,
  colorFn,
}: {
  label: string
  items: T[]
  selected: T[]
  onToggle: (item: T) => void
  colorFn?: (item: T) => string
}) {
  return (
    <div>
      <p
        className="mono mb-3"
        style={{
          color: "#475569",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <div className="space-y-1.5">
        {items.map((item) => {
          const active = selected.includes(item)
          const color = colorFn?.(item)
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all"
              style={{
                background: active
                  ? color
                    ? `${color}12`
                    : "rgba(59,130,246,0.12)"
                  : "transparent",
                border: `1px solid ${active ? (color ?? "rgba(59,130,246,0.3)") + "40" : "transparent"}`,
                color: active ? (color ?? "#3B82F6") : "#64748B",
                fontSize: "0.8125rem",
              }}
            >
              {color && (
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: active ? color : "#1E293B" }}
                />
              )}
              {item}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface FilterSidebarProps {
  selectedSeverities: Severity[]
  selectedStatuses: Status[]
  selectedCauses: Cause[]
  onToggleSeverity: (s: Severity) => void
  onToggleStatus: (s: Status) => void
  onToggleCause: (c: Cause) => void
  onClearAll: () => void
}

export function FilterSidebar({
  selectedSeverities,
  selectedStatuses,
  selectedCauses,
  onToggleSeverity,
  onToggleStatus,
  onToggleCause,
  onClearAll,
}: FilterSidebarProps) {
  const activeFilterCount =
    selectedSeverities.length +
    selectedStatuses.length +
    selectedCauses.length

  return (
    <aside className="w-64 flex-shrink-0">
      <GlassCard hover={false} className="sticky top-24">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} style={{ color: "#3B82F6" }} />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "#E2E8F0",
              }}
            >
              Filters
            </span>
            {activeFilterCount > 0 && (
              <span
                className="mono rounded px-1.5 py-0.5"
                style={{
                  background: "#3B82F6",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="mono transition-colors hover:text-red-400"
              style={{ color: "#475569", fontSize: "0.68rem" }}
            >
              Clear all
            </button>
          )}
        </div>

        <FilterGroup
          label="Severity"
          items={SEVERITIES}
          selected={selectedSeverities}
          onToggle={onToggleSeverity}
          colorFn={severityColor}
        />

        <div
          className="my-5 h-px"
          style={{ background: "rgba(59,130,246,0.08)" }}
        />

        <FilterGroup
          label="Status"
          items={STATUSES}
          selected={selectedStatuses}
          onToggle={onToggleStatus}
        />

        <div
          className="my-5 h-px"
          style={{ background: "rgba(59,130,246,0.08)" }}
        />

        <FilterGroup
          label="Cause"
          items={CAUSES}
          selected={selectedCauses}
          onToggle={onToggleCause}
        />
      </GlassCard>
    </aside>
  )
}
