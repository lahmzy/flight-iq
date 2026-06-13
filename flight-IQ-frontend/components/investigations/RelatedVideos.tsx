import { Play } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"

const relatedVideos = [
  {
    title: "ATC Audio: AA1077 Emergency Declaration",
    channel: "LiveATC.net Archive",
    duration: "14:22",
    views: "1.2M",
  },
  {
    title: "Investigation Overview with Aviation Analyst",
    channel: "AviationWeek",
    duration: "28:41",
    views: "892K",
  },
  {
    title: "How Turbine Blade Fatigue Failures Occur",
    channel: "Engineering Explained Aviation",
    duration: "19:07",
    views: "2.1M",
  },
]

export function RelatedVideos() {
  return (
    <GlassCard hover={false}>
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <Play size={15} style={{ color: "#EF4444" }} />
        </div>
        <SectionLabel eyebrow="" title="Related Videos" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {relatedVideos.map((v, i) => (
          <div
            key={i}
            className="group cursor-pointer overflow-hidden rounded-xl transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            style={{ border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="relative flex aspect-video items-center justify-center"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all group-hover:scale-110"
                style={{ background: "rgba(239,68,68,0.8)" }}
              >
                <Play size={16} className="ml-0.5 text-white" />
              </div>
              <div
                className="mono absolute right-2 bottom-2 rounded px-2 py-0.5"
                style={{
                  background: "rgba(0,0,0,0.7)",
                  color: "#E2E8F0",
                  fontSize: "0.65rem",
                }}
              >
                {v.duration}
              </div>
            </div>
            <div className="p-3">
              <p
                className="transition-colors group-hover:text-blue-400"
                style={{
                  color: "#CBD5E1",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {v.title}
              </p>
              <p
                className="mono mt-1"
                style={{ color: "#475569", fontSize: "0.65rem" }}
              >
                {v.channel} · {v.views} views
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
