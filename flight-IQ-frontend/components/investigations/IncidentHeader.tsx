import Link from "next/link"
import { ArrowLeft, Calendar, ExternalLink, MapPin, Plane } from "lucide-react"

import { SeverityBadge, StatusBadge } from "@/components/ui/SeverityBadge"
import type { BackendIncidentDetail } from "@/types/incident"
import { incidentTitle, formatIncidentLocation } from "@/lib/incident-display"
import { formatStatus } from "@/lib/incident-display"

export function IncidentHeader({ incident }: { incident: BackendIncidentDetail }) {
  const title = incident.title?.trim() || incidentTitle(incident)
  const location = formatIncidentLocation(incident)

  const primaryAircraft = incident.aircraft.find((a) => a.isPrimary) ?? incident.aircraft[0]
  const phase = primaryAircraft?.aircraft.flightPhase?.trim()

  const ntsbGovUrl = incident.ntsbNo
    ? `https://data.ntsb.gov/carol-repgen/api/Aviation/ReportMain/GenerateNewestReport/${incident.ntsbNo}/true`
    : null

  return (
    <>
      <Link
        href="/incident"
        className="mb-8 inline-flex items-center gap-2 transition-colors hover:text-white"
        style={{ color: "#64748B", fontSize: "0.875rem" }}
      >
        <ArrowLeft size={15} /> Back to Investigations
      </Link>

      <div className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={formatStatus(incident.status)} />
          {incident.evType && (
            <span
              className="mono rounded px-2 py-0.5"
              style={{
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "#A78BFA",
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {incident.evType}
            </span>
          )}
          {incident.ntsbNo && (
            <span
              className="mono"
              style={{ color: "#475569", fontSize: "0.68rem" }}
            >
              {incident.ntsbNo}
            </span>
          )}
        </div>

        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            color: "#F1F5F9",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div
            className="mono flex items-center gap-2"
            style={{ color: "#64748B", fontSize: "0.75rem" }}
          >
            <Calendar size={13} />
            {new Date(incident.incidentDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {location && (
            <div
              className="mono flex items-center gap-2"
              style={{ color: "#64748B", fontSize: "0.75rem" }}
            >
              <MapPin size={13} /> {location}
            </div>
          )}

          {phase && (
            <div
              className="mono flex items-center gap-2"
              style={{ color: "#64748B", fontSize: "0.75rem" }}
            >
              <Plane size={13} /> {phase.replace(/_/g, " ")} phase
            </div>
          )}

          {ntsbGovUrl && (
            <a
              href={ntsbGovUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono flex items-center gap-1.5 transition-colors hover:text-blue-300"
              style={{ color: "#3B82F6", fontSize: "0.75rem" }}
            >
              <ExternalLink size={12} /> NTSB Report
            </a>
          )}
        </div>
      </div>
    </>
  )
}
