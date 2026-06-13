import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"

const timelineEvents = [
  {
    time: "09:42 UTC",
    phase: "Departure",
    event:
      "Aircraft departed with 168 persons on board. Pre-flight checks normal.",
    type: "normal" as const,
  },
  {
    time: "10:18 UTC",
    phase: "Cruise",
    event:
      "Reached cruise altitude FL350. All systems nominal. Autopilot engaged.",
    type: "normal" as const,
  },
  {
    time: "11:02 UTC",
    phase: "Cruise",
    event:
      "Crew reported vibration in right engine. Engine parameters within limits.",
    type: "warning" as const,
  },
  {
    time: "11:09 UTC",
    phase: "Cruise",
    event:
      "Engine No. 2 warning light illuminated. EGT exceeded limits. Engine fire suppression armed.",
    type: "critical" as const,
  },
  {
    time: "11:11 UTC",
    phase: "Emergency",
    event:
      "Crew declared MAYDAY. Engine No. 2 shut down. Emergency descent initiated.",
    type: "critical" as const,
  },
  {
    time: "11:23 UTC",
    phase: "Emergency",
    event:
      "ATC cleared runway 16R at KDEN for priority landing. ARFF units alerted.",
    type: "warning" as const,
  },
  {
    time: "11:31 UTC",
    phase: "Landing",
    event:
      "Aircraft landed safely at Denver International Airport. Three passengers treated for minor injuries.",
    type: "normal" as const,
  },
]

function dotColor(type: "normal" | "warning" | "critical") {
  if (type === "critical") return "#EF4444"
  if (type === "warning") return "#F59E0B"
  return "#3B82F6"
}

function textColor(type: "normal" | "warning" | "critical") {
  if (type === "critical") return "#FCA5A5"
  if (type === "warning") return "#FCD34D"
  return "#CBD5E1"
}

export function EventTimeline() {
  return (
    <GlassCard hover={false}>
      <SectionLabel eyebrow="Sequence of Events" title="Event Timeline" />
      <div className="mt-6 space-y-0">
        {timelineEvents.map((event, i) => {
          const color = dotColor(event.type)
          return (
            <div key={i} className="relative flex gap-4">
              {i < timelineEvents.length - 1 && (
                <div
                  className="absolute top-8 w-px"
                  style={{
                    left: "0.45rem",
                    height: "calc(100% - 8px)",
                    background: "rgba(59,130,246,0.15)",
                  }}
                />
              )}
              <div className="relative z-10 mt-1.5 flex-shrink-0">
                <div
                  className="h-3.5 w-3.5 rounded-full border-2 border-[#050816]"
                  style={{
                    background: color,
                    boxShadow: `0 0 8px ${color}70`,
                  }}
                />
              </div>
              <div className="flex-1 pb-8">
                <div className="mb-1 flex items-center gap-3">
                  <span
                    className="mono"
                    style={{
                      color: "#3B82F6",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    }}
                  >
                    {event.time}
                  </span>
                  <span
                    className="mono rounded px-2 py-0.5"
                    style={{
                      color: "#64748B",
                      background: "rgba(255,255,255,0.04)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {event.phase}
                  </span>
                </div>
                <p
                  style={{
                    color: textColor(event.type),
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                >
                  {event.event}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
