import { Scale } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import type { BackendIncidentDetail, BackendFinding, FindingCategory } from "@/types/incident"

const CATEGORY_COLORS: Record<FindingCategory, { bg: string; text: string; dot: string }> = {
  Personnel: { bg: "rgba(239,68,68,0.1)", text: "#EF4444", dot: "#EF4444" },
  Environmental: { bg: "rgba(59,130,246,0.1)", text: "#3B82F6", dot: "#3B82F6" },
  Aircraft: { bg: "rgba(139,92,246,0.1)", text: "#8B5CF6", dot: "#8B5CF6" },
  Organization: { bg: "rgba(16,185,129,0.1)", text: "#10B981", dot: "#10B981" },
  Other: { bg: "rgba(245,158,11,0.1)", text: "#F59E0B", dot: "#F59E0B" },
}

function FindingRow({ finding }: { finding: BackendFinding }) {
  const colors = CATEGORY_COLORS[finding.category]
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold"
          style={{
            background: colors.bg,
            color: colors.text,
            fontSize: "0.65rem",
            letterSpacing: "0.04em",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: colors.dot }}
          />
          {finding.category}
        </span>
        {finding.findingCode && (
          <span
            className="mono rounded-md px-2 py-0.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#64748B",
              fontSize: "0.6rem",
            }}
          >
            {finding.findingCode}
          </span>
        )}
      </div>
      {finding.description && (
        <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.65 }}>
          {finding.description}
        </p>
      )}
    </div>
  )
}

export function FindingsCard({ incident }: { incident: BackendIncidentDetail }) {
  const allFindings = incident.aircraft
    .flatMap((link) => link.aircraft.findings ?? [])
    .filter((f) => f.description || f.findingCode)

  if (allFindings.length === 0) return null

  return (
    <GlassCard hover={false}>
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <Scale size={15} style={{ color: "#8B5CF6" }} />
        </div>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "#E2E8F0",
          }}
        >
          Findings
        </span>
        <span
          className="mono ml-auto rounded-md px-2 py-0.5"
          style={{
            background: "rgba(139,92,246,0.1)",
            color: "#8B5CF6",
            fontSize: "0.65rem",
          }}
        >
          {allFindings.length}
        </span>
      </div>
      <div className="space-y-3">
        {allFindings.map((finding) => (
          <FindingRow key={finding.id} finding={finding} />
        ))}
      </div>
    </GlassCard>
  )
}
