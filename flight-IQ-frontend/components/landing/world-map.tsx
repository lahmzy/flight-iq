const CONTINENTS = [
  { x: 105, y: 80, w: 85, h: 70 },
  { x: 210, y: 60, w: 125, h: 95 },
  { x: 348, y: 90, w: 72, h: 65 },
  { x: 430, y: 105, w: 95, h: 95 },
  { x: 530, y: 75, w: 100, h: 110 },
  { x: 610, y: 70, w: 65, h: 65 },
  { x: 690, y: 175, w: 75, h: 85 },
  { x: 170, y: 175, w: 60, h: 75 },
  { x: 265, y: 215, w: 60, h: 85 },
  { x: 155, y: 240, w: 45, h: 55 },
  { x: 580, y: 155, w: 55, h: 40 },
  { x: 460, y: 155, w: 45, h: 55 },
  { x: 385, y: 60, w: 50, h: 40 },
]

const NODES = [
  { cx: 145, cy: 115, label: "JFK" },
  { cx: 130, cy: 135, label: "MIA" },
  { cx: 165, cy: 100, label: "YYZ" },
  { cx: 255, cy: 130, label: "ATL" },
  { cx: 130, cy: 185, label: "GRU" },
  { cx: 270, cy: 110, label: "LHR" },
  { cx: 300, cy: 135, label: "CDG" },
  { cx: 340, cy: 105, label: "FRA" },
  { cx: 475, cy: 140, label: "DXB" },
  { cx: 545, cy: 130, label: "DEL" },
  { cx: 610, cy: 120, label: "BKK" },
  { cx: 640, cy: 100, label: "HND" },
  { cx: 660, cy: 115, label: "ICN" },
  { cx: 285, cy: 235, label: "JNB" },
  { cx: 700, cy: 220, label: "SYD" },
  { cx: 690, cy: 195, label: "SIN" },
]

const ROUTES = [
  "M 145 115 Q 220 70 270 110",
  "M 270 110 Q 350 85 475 140",
  "M 475 140 Q 510 120 640 100",
  "M 145 115 Q 130 155 130 185",
  "M 270 110 Q 275 180 285 235",
  "M 475 140 Q 530 120 545 130",
  "M 545 130 Q 580 125 610 120",
  "M 640 100 Q 660 100 660 115",
  "M 690 195 Q 700 200 700 220",
  "M 545 130 Q 620 155 690 195",
]

function generateDots() {
  const dots: { cx: number; cy: number; r: number }[] = []
  let seed = 1234
  for (const c of CONTINENTS) {
    for (let x = c.x; x < c.x + c.w; x += 5) {
      for (let y = c.y; y < c.y + c.h; y += 5) {
        seed = (seed * 9301 + 49297) % 233280
        const v = seed / 233280
        if (v > 0.42) {
          dots.push({ cx: x, cy: y, r: 0.7 })
        }
      }
    }
  }
  return dots
}

const DOTS = generateDots()

export function WorldMap({
  className,
  showNodes = true,
}: {
  className?: string
  showNodes?: boolean
}) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 800 400"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="map-glow-lg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity="0.06" stroke="#3B82F6" strokeWidth="0.3">
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={(i + 1) * 40}
              x2="800"
              y2={(i + 1) * 40}
            />
          ))}
          {Array.from({ length: 20 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={(i + 1) * 40}
              y1="0"
              x2={(i + 1) * 40}
              y2="400"
            />
          ))}
        </g>

        {DOTS.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill="#3B82F6"
            opacity="0.4"
          />
        ))}

        {showNodes &&
          ROUTES.map((d, i) => (
            <path
              key={`route${i}`}
              d={d}
              stroke="#3B82F6"
              strokeWidth="0.6"
              strokeDasharray="3 4"
              fill="none"
              opacity="0.3"
            />
          ))}

        {showNodes &&
          NODES.map((n) => (
            <g key={n.label}>
              <circle
                cx={n.cx}
                cy={n.cy}
                r="20"
                fill="url(#map-glow-lg)"
                opacity="0.5"
              />
              <circle
                cx={n.cx}
                cy={n.cy}
                r="4"
                fill="#3B82F6"
                opacity="0.9"
                filter="url(#glow)"
              />
              <circle cx={n.cx} cy={n.cy} r="1.8" fill="#ffffff" />
            </g>
          ))}
      </svg>
    </div>
  )
}