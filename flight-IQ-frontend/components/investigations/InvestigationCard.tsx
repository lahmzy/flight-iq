import Link from "next/link"
import { ArrowRight, MapPin, Plane } from "lucide-react"

import {
  CauseBadge,
  SeverityBadge,
  StatusBadge,
} from "@/components/ui/SeverityBadge"
import { GlassCard } from "@/components/ui/GlassCard"
import type { Incident } from "@/lib/landing-data"

export function InvestigationCard({ incident }: { incident: Incident }) {
  return (
    <Link href={`/incident/${incident.id}`}>
      <GlassCard className="group" padding="p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
              {incident.causes.map((c) => (
                <CauseBadge key={c} cause={c} />
              ))}
            </div>
            <h3
              className="mb-2 transition-colors group-hover:text-blue-400"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "1.0625rem",
                color: "#E2E8F0",
              }}
            >
              {incident.title}
            </h3>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <div
                className="mono flex items-center gap-1.5"
                style={{ color: "#64748B", fontSize: "0.72rem" }}
              >
                <Plane size={11} /> {incident.aircraft}
              </div>
              <div
                className="mono flex items-center gap-1.5"
                style={{ color: "#64748B", fontSize: "0.72rem" }}
              >
                <MapPin size={11} /> {incident.location}, {incident.country}
              </div>
              <div
                className="mono"
                style={{ color: "#64748B", fontSize: "0.72rem" }}
              >
                {new Date(incident.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="flex w-full sm:w-auto items-center justify-between sm:flex-col sm:items-end border-t border-slate-800/40 pt-3 sm:border-none sm:pt-0 gap-2 sm:flex-shrink-0">
            <div>
              {incident.fatalities > 0 ? (
                <div className="text-left sm:text-right">
                  <div
                    className="mono"
                    style={{
                      color: "#EF4444",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {incident.fatalities}
                  </div>
                  <div
                    className="mono"
                    style={{ color: "#475569", fontSize: "0.62rem" }}
                  >
                    fatalities
                  </div>
                </div>
              ) : (
                <div
                  className="mono rounded px-2 py-1"
                  style={{
                    color: "#10B981",
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    fontSize: "0.62rem",
                  }}
                >
                  NO FATALITIES
                </div>
              )}
            </div>
            <ArrowRight
              size={15}
              className="transition-all group-hover:translate-x-1"
              style={{ color: "#334155" }}
            />
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}
