import Link from "next/link"

import { GlassCard } from "@/components/ui/GlassCard"
import type { Incident } from "@/lib/landing-data"

export function RelatedIncidents({
  incidents,
}: {
  incidents: Incident[]
}) {
  return (
    <GlassCard hover={false}>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 600,
          fontSize: "0.9375rem",
          color: "#E2E8F0",
          marginBottom: "1rem",
        }}
      >
        Related Incidents
      </p>
      <div className="space-y-3">
        {incidents.map((r) => (
          <Link key={r.id} href={`/investigations/${r.id}`}>
            <div
              className="group cursor-pointer rounded-lg p-3 transition-all hover:border-blue-500/20"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <p
                className="transition-colors group-hover:text-blue-400"
                style={{
                  color: "#CBD5E1",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {r.title}
              </p>
              <p
                className="mono mt-1"
                style={{ color: "#475569", fontSize: "0.65rem" }}
              >
                {r.aircraft} ·{" "}
                {new Date(r.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  )
}
