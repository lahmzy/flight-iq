"use client"

import type { Incident, Severity } from "@/lib/landing-data"

const severityColors: Record<Severity, string> = {
  Fatal: "#EF4444",
  Major: "#F97316",
  Moderate: "#F59E0B",
  Minor: "#10B981",
}

interface WorldSVGMapProps {
  items: Incident[]
  selected: string | null
  onSelect: (id: string | null) => void
  heatmap: boolean
}

function toXY(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  }
}

export function WorldSVGMap({ items, selected, onSelect, heatmap }: WorldSVGMapProps) {
  return (
    <div className="relative w-full h-full" style={{ background: "rgba(2,6,16,0.98)" }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
          backgroundSize: "5% 16.66%",
        }}
      />

      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="incGlow-red" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="incGlow-orange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="incGlow-yellow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="incGlow-green" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
          </radialGradient>
        </defs>

        <g
          fill="rgba(59,130,246,0.05)"
          stroke="rgba(59,130,246,0.2)"
          strokeWidth="0.8"
        >
          <path d="M80,60 L180,50 L230,70 L250,120 L240,160 L220,180 L200,200 L180,250 L150,290 L120,300 L100,280 L90,250 L70,230 L60,200 L50,170 L55,130 L65,95 Z" />
          <path d="M180,20 L220,15 L240,30 L235,55 L210,65 L185,55 Z" />
          <path d="M170,290 L230,280 L270,310 L290,360 L280,400 L260,430 L230,450 L200,440 L180,420 L165,380 L150,340 L155,310 Z" />
          <path d="M370,50 L430,45 L470,55 L480,80 L460,100 L430,110 L400,105 L380,90 L365,75 Z" />
          <path d="M380,110 L450,100 L490,120 L510,160 L520,220 L510,280 L490,330 L460,360 L420,370 L380,360 L355,320 L345,270 L350,210 L360,160 Z" />
          <path d="M470,30 L600,20 L720,30 L800,50 L830,80 L820,120 L780,150 L720,160 L660,170 L600,165 L540,155 L490,140 L470,110 L460,80 Z" />
          <path d="M600,160 L660,165 L690,180 L700,220 L685,250 L660,260 L635,255 L615,235 L600,210 L595,185 Z" />
          <path d="M700,160 L770,155 L810,170 L820,200 L800,225 L760,230 L720,220 L700,200 Z" />
          <path d="M720,280 L800,270 L850,285 L870,320 L860,360 L830,385 L780,390 L730,380 L700,355 L695,320 Z" />
          <path d="M810,90 L840,85 L860,100 L855,130 L830,140 L810,130 Z" />
        </g>

        {heatmap &&
          items.map((inc) => {
            const { x, y } = toXY(inc.lat, inc.lng)
            const gx = x * 10
            const gy = y * 5
            const gradId =
              inc.severity === "Fatal" || inc.severity === "Major"
                ? "incGlow-red"
                : inc.severity === "Moderate"
                  ? "incGlow-yellow"
                  : "incGlow-green"
            return <circle key={`heat-${inc.id}`} cx={gx} cy={gy} r="40" fill={`url(#${gradId})`} />
          })}

        {items.map((inc) => {
          const { x, y } = toXY(inc.lat, inc.lng)
          const gx = x * 10
          const gy = y * 5
          const color = severityColors[inc.severity]
          const isSelected = selected === inc.id
          return (
            <g
              key={inc.id}
              transform={`translate(${gx},${gy})`}
              onClick={() => onSelect(isSelected ? null : inc.id)}
              style={{ cursor: "pointer" }}
            >
              <circle r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.3">
                <animate
                  attributeName="r"
                  from="8"
                  to="20"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.4"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                r={isSelected ? 7 : 5}
                fill={color}
                stroke="#fff"
                strokeWidth={isSelected ? 2 : 1}
                style={{
                  filter: `drop-shadow(0 0 ${isSelected ? 8 : 4}px ${color})`,
                  transition: "all 0.2s",
                }}
              />
            </g>
          )
        })}
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-px h-4"
          style={{ background: "rgba(59,130,246,0.3)" }}
        />
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 h-px w-4"
          style={{ background: "rgba(59,130,246,0.3)" }}
        />
        <div
          className="mono absolute bottom-2 right-2"
          style={{ color: "#1E3A5F", fontSize: "0.6rem" }}
        >
          MERCATOR PROJECTION
        </div>
      </div>
    </div>
  )
}
