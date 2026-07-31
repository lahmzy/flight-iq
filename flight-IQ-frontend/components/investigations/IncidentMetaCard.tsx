import { Copy, ExternalLink, FileDigit } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import type { BackendIncidentDetail } from "@/types/incident"

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span
        className="mono flex-shrink-0"
        style={{ color: "#475569", fontSize: "0.72rem" }}
      >
        {label}
      </span>
      <span
        className="mono text-right"
        style={{ color: "#94A3B8", fontSize: "0.78rem" }}
      >
        {value}
      </span>
    </div>
  )
}

function CopyableId({ value }: { value: string }) {
  const copy = () => navigator.clipboard.writeText(value).catch(() => {})
  return (
    <button
      onClick={copy}
      title="Copy to clipboard"
      className="mono group flex items-center gap-1.5 transition-colors hover:text-blue-400"
      style={{ color: "#94A3B8", fontSize: "0.78rem" }}
    >
      <span>{value}</span>
      <Copy size={10} className="opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  )
}

export function IncidentMetaCard({ incident }: { incident: BackendIncidentDetail }) {
  const ntsbGovUrl = incident.ntsbNo
    ? `https://data.ntsb.gov/carol-repgen/api/Aviation/ReportMain/GenerateNewestReport/${incident.ntsbNo}/true`
    : null

  const rows = [
    incident.ntsbEventId
      ? (["NTSB Event ID", <CopyableId key="evid" value={incident.ntsbEventId} />] as [string, React.ReactNode])
      : null,
    incident.ntsbNo
      ? (["Report No.", <CopyableId key="rno" value={incident.ntsbNo} />] as [string, React.ReactNode])
      : null,
    incident.evType ? (["Event Type", incident.evType] as [string, React.ReactNode]) : null,
    ["Status", incident.status.replace(/([A-Z])/g, " $1").trim()] as [string, React.ReactNode],
    [
      "Recorded",
      new Date(incident.incidentDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    ] as [string, React.ReactNode],
  ].filter(Boolean) as Array<[string, React.ReactNode]>

  return (
    <GlassCard hover={false}>
      <div className="mb-5 flex items-center gap-2">
        <FileDigit size={15} style={{ color: "#3B82F6" }} />
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "#E2E8F0",
          }}
        >
          NTSB Record
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <MetaRow key={i} label={row[0]} value={row[1]} />
        ))}
      </div>

      {ntsbGovUrl && (
        <a
          href={ntsbGovUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 transition-all hover:border-blue-500/40"
          style={{
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.18)",
            color: "#3B82F6",
            fontSize: "0.8125rem",
            fontWeight: 500,
          }}
        >
          View on NTSB.gov <ExternalLink size={13} />
        </a>
      )}
    </GlassCard>
  )
}
