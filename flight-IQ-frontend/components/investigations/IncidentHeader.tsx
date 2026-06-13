import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Plane } from "lucide-react"

import {
  SeverityBadge,
  StatusBadge,
} from "@/components/ui/SeverityBadge"
import type { Incident } from "@/lib/landing-data"

export function IncidentHeader({ incident }: { incident: Incident }) {
  return (
    <>
      <Link
        href="/investigations"
        className="mb-8 inline-flex items-center gap-2 transition-colors hover:text-white"
        style={{ color: "#64748B", fontSize: "0.875rem" }}
      >
        <ArrowLeft size={15} /> Back to Investigations
      </Link>

      <div className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
          <span
            className="mono"
            style={{ color: "#475569", fontSize: "0.68rem" }}
          >
            {incident.id}
          </span>
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
          {incident.title}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div
            className="mono flex items-center gap-2"
            style={{ color: "#64748B", fontSize: "0.75rem" }}
          >
            <Calendar size={13} />
            {new Date(incident.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div
            className="mono flex items-center gap-2"
            style={{ color: "#64748B", fontSize: "0.75rem" }}
          >
            <MapPin size={13} /> {incident.location}, {incident.country}
          </div>
          <div
            className="mono flex items-center gap-2"
            style={{ color: "#64748B", fontSize: "0.75rem" }}
          >
            <Plane size={13} /> {incident.phase} phase
          </div>
        </div>
      </div>
    </>
  )
}
