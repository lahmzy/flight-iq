import {
  AlertTriangle,
  Bird,
  Brain,
  CloudRain,
  Cpu,
  Fuel,
  Plane,
  Radio,
  Wrench,
  type LucideIcon,
} from "lucide-react"

export const heroStats = [
  { value: "24,812", label: "Active Logs" },
  { value: "0.02s", label: "Latency Avg" },
  { value: "ICAO-III", label: "Compliance" },
] as const

export const featuredInvestigation = {
  id: "FLG-882-PAC",
  title: "Trans-Pacific Flight 882 Anomalous Descent",
  description:
    "Deep telemetry scan shows uncommanded pitch variance at FL350. Investigating sensor fusion error in the AHRS primary module.",
  badges: ["HIGH PRIORITY", "ACTIVE OPS"],
  meta: { lastPing: "2m ago", sector: "Sector 4-G (Pacific)" },
  imageGradient:
    "from-[#0a1530] via-[#0f2147] to-[#050816] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.25),transparent_50%)]",
}

export type LiveLog = {
  id: string
  title: string
  description: string
  badge: string
  progress: number
  status: "warning" | "info"
  icon: LucideIcon
}

export const liveLogs: LiveLog[] = [
  {
    id: "log-772-b",
    title: "Engine 2 Thermal Spike",
    description:
      "N1 vibrations exceeding safety envelope on climbing phase. Preliminary metadata suggests bearing failure.",
    badge: "LOG #772-B",
    progress: 72,
    status: "warning",
    icon: AlertTriangle,
  },
  {
    id: "log-ads-b",
    title: "ADS-B Coverage Gap",
    description:
      "Extended signal dropout over Arctic corridor. Analyzing atmospheric interference vs antenna degradation.",
    badge: "TELEMETRY SYNC",
    progress: 38,
    status: "info",
    icon: Radio,
  },
]

export type TaxonomyCategory = {
  title: string
  description: string
  cases: string
  icon: LucideIcon
}

export const taxonomyCategories: TaxonomyCategory[] = [
  {
    title: "Pilot Error",
    description: "Human factor analysis, fatigue, and CRM failure patterns.",
    cases: "4,201",
    icon: Brain,
  },
  {
    title: "Weather",
    description: "Microbursts, CAT, and severe icing condition datasets.",
    cases: "2,894",
    icon: CloudRain,
  },
  {
    title: "Mechanical",
    description: "Structural fatigue and propulsion system failure logs.",
    cases: "3,552",
    icon: Wrench,
  },
  {
    title: "Bird Strike",
    description: "Wildlife impact forensic data and ingestion damage reports.",
    cases: "912",
    icon: Bird,
  },
  {
    title: "ATC Factors",
    description: "Communication lapses and runway incursion anomalies.",
    cases: "1,128",
    icon: Radio,
  },
  {
    title: "Avionics",
    description: "Logic errors, sensor failures, and software glitched.",
    cases: "843",
    icon: Cpu,
  },
  {
    title: "Fuel Issues",
    description: "Exhaustion patterns and contamination forensic analysis.",
    cases: "418",
    icon: Fuel,
  },
]

export const hubStats = [
  {
    label: "Avg Response",
    value: "14.2m",
    sub: "-12% from last quarter",
    icon: Plane,
  },
  {
    label: "Nodes Synced",
    value: "1,402",
    sub: "100% System Uptime",
    icon: Radio,
  },
  {
    label: "Deep Scan Depth",
    value: "2.4PB",
    sub: "Encrypted Cold Storage",
    icon: Cpu,
  },
  {
    label: "Authors",
    value: "850+",
    sub: "Certified Investigators",
    icon: Brain,
  },
] as const

export const hubDetailItems = [
  {
    label: "Active Satellite Feeds",
    value: "284 / 300",
  },
  {
    label: "Node Correlation",
    value: "99.4%",
  },
]

export const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Investigations", href: "#investigations" },
      { label: "Cause Taxonomy", href: "#taxonomy" },
      { label: "Global Hub", href: "#hub" },
      { label: "Safety Reports", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Data Handling", href: "#" },
    ],
  },
] as const

export const navLinks = [
  { label: "Dashboard", href: "#hero" },
  { label: "Investigations", href: "#investigations" },
  { label: "Radar", href: "#hub" },
] as const
