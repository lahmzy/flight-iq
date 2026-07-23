import { BookOpen, ExternalLink, TriangleAlert } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import type { BackendIncidentDetail, BackendAircraftNarrative } from "@/types/incident"

function OfficialCauseBlock({ cause }: { cause: string }) {
  return (
    <div
      className="mt-5 rounded-xl p-4"
      style={{
        background: "rgba(239,68,68,0.05)",
        border: "1px solid rgba(239,68,68,0.15)",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <TriangleAlert size={13} style={{ color: "#EF4444" }} />
        <span
          className="mono"
          style={{ color: "#EF4444", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}
        >
          Probable Cause
        </span>
      </div>
      <p style={{ color: "#FCA5A5", fontSize: "0.9rem", lineHeight: 1.75 }}>{cause}</p>
    </div>
  )
}

function EmptyState({ ntsbNo }: { ntsbNo?: string | null }) {
  const url = ntsbNo
    ? `https://data.ntsb.gov/carol-repgen/api/Aviation/ReportMain/GenerateNewestReport/${ntsbNo}/true`
    : null
  return (
    <div
      className="rounded-xl p-6 text-center"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px dashed rgba(255,255,255,0.08)",
      }}
    >
      <p style={{ color: "#475569", fontSize: "0.9rem" }}>
        Narrative not yet available for this NTSB record.
      </p>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mono mt-3 inline-flex items-center gap-1.5 transition-colors hover:text-blue-300"
          style={{ color: "#3B82F6", fontSize: "0.8rem" }}
        >
          View on NTSB.gov <ExternalLink size={12} />
        </a>
      )}
    </div>
  )
}

interface NarrativeCardProps {
  incident: BackendIncidentDetail
  narrative: BackendAircraftNarrative | null | undefined
}

export function InvestigationSummary({ incident, narrative }: NarrativeCardProps) {
  const findingsText = incident.aircraft
    .flatMap((a) => a.aircraft.findings ?? [])
    .map((f) => f.description?.trim())
    .filter(Boolean)
    .join("\n\n") || null

  const bodyText =
    findingsText ||
    incident.summary?.trim() ||
    narrative?.narrativeAccp?.trim() ||
    narrative?.narrativeInc?.trim() ||
    narrative?.narrativeAccf?.trim() ||
    null

  // Official cause — separate highlighted block
  const causeText =
    incident.officialCause?.trim() ||
    narrative?.narrativeCause?.trim() ||
    null

  return (
    <GlassCard hover={false}>
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <BookOpen size={15} style={{ color: "#3B82F6" }} />
        </div>
        <SectionLabel eyebrow="" title="Investigation Narrative" />
      </div>

      {bodyText ? (
        <p
          style={{
            color: "#94A3B8",
            fontSize: "0.95rem",
            lineHeight: 1.85,
            whiteSpace: "pre-wrap",
          }}
        >
          {bodyText}
        </p>
      ) : (
        <EmptyState ntsbNo={incident.ntsbNo} />
      )}

      {causeText && <OfficialCauseBlock cause={causeText} />}
    </GlassCard>
  )
}
