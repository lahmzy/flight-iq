import { Clock, ExternalLink, FileText } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"

const reports = [
  {
    name: "Preliminary Report",
    authority: "NTSB",
    status: "Available" as const,
    date: "Jun 14, 2026",
  },
  {
    name: "Factual Report",
    authority: "NTSB",
    status: "In progress" as const,
    date: "Est. Sep 2026",
  },
  {
    name: "Final Report",
    authority: "NTSB",
    status: "Pending" as const,
    date: "Est. 2027",
  },
]

export function OfficialReports() {
  return (
    <GlassCard hover={false}>
      <div className="mb-5 flex items-center gap-2">
        <FileText size={15} style={{ color: "#3B82F6" }} />
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "#E2E8F0",
          }}
        >
          Official Reports
        </span>
      </div>
      <div className="space-y-3">
        {reports.map((r) => (
          <div
            key={r.name}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg p-3 transition-all hover:border-blue-500/25"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div>
              <p
                style={{
                  color: "#CBD5E1",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                }}
              >
                {r.name}
              </p>
              <p
                className="mono"
                style={{ color: "#475569", fontSize: "0.65rem" }}
              >
                {r.authority} · {r.date}
              </p>
            </div>
            <div>
              {r.status === "Available" ? (
                <ExternalLink size={13} style={{ color: "#3B82F6" }} />
              ) : (
                <Clock size={13} style={{ color: "#475569" }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
