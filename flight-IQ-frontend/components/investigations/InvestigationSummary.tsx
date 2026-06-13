import { BookOpen } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import type { Incident } from "@/lib/landing-data"

export function InvestigationSummary({ incident }: { incident: Incident }) {
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
        <SectionLabel eyebrow="" title="Investigation Summary" />
      </div>
      <p
        style={{
          color: "#94A3B8",
          fontSize: "0.95rem",
          lineHeight: 1.8,
        }}
      >
        {incident.summary}
      </p>
      <p
        className="mt-4"
        style={{
          color: "#94A3B8",
          fontSize: "0.95rem",
          lineHeight: 1.8,
        }}
      >
        The National Transportation Safety Board (NTSB) opened a full
        investigation on{" "}
        {new Date(incident.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        . Investigators retrieved the Flight Data Recorder (FDR) and Cockpit
        Voice Recorder (CVR) from the aircraft. Engine components have been
        shipped to the NTSB laboratory in Washington D.C. for metallurgical
        analysis. The preliminary report is expected within 30 days of the
        accident date.
      </p>
    </GlassCard>
  )
}
