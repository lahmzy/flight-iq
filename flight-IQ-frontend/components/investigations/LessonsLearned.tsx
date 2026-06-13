import { Shield } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"

const lessons = [
  "Review of turbine blade inspection intervals granted under STC amendments, particularly for HCF-prone geometries with ceramic thermal barrier coatings.",
  "Evaluation of FPI sensitivity for sub-surface crack detection in blade root attachment zones. Alternative NDT methods (ACFM, phased-array UT) may be more appropriate.",
  "Operators should cross-reference blade cycle counts against amended inspection schedules during heavy maintenance events.",
  "The crew's adherence to QRH procedures and effective CRM resulted in a successful outcome. This event provides valuable training material for multi-engine emergency management.",
]

export function LessonsLearned() {
  return (
    <GlassCard hover={false}>
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <Shield size={15} style={{ color: "#10B981" }} />
        </div>
        <SectionLabel eyebrow="" title="Lessons Learned" />
      </div>
      <div className="space-y-4">
        {lessons.map((lesson, i) => (
          <div key={i} className="flex gap-4">
            <div
              className="mono mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
              style={{
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "#10B981",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              {i + 1}
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.65 }}>
              {lesson}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
