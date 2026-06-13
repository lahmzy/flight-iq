import {
  AlertTriangle,
  Bird,
  Cloud,
  Fuel,
  Radio,
  Wrench,
  type LucideIcon,
} from "lucide-react"

export type Severity = "Fatal" | "Major" | "Moderate" | "Minor"
export type Status =
  | "Under Investigation"
  | "Preliminary Report"
  | "Final Report"
  | "Closed"
export type Cause =
  | "Pilot Error"
  | "Weather"
  | "Mechanical Failure"
  | "Bird Strike"
  | "Fuel Issues"
  | "Maintenance"
  | "ATC Error"

export interface Incident {
  id: string
  title: string
  date: string
  location: string
  country: string
  aircraft: string
  registration: string
  airline: string
  flightNumber: string
  severity: Severity
  status: Status
  causes: Cause[]
  fatalities: number
  injuries: number
  occupants: number
  summary: string
  lat: number
  lng: number
  departureAirport: string
  destinationAirport: string
  phase: string
}

export const incidents: Incident[] = [
  {
    id: "INC-2026-0601",
    title: "American 1077 Engine Failure & Emergency Landing",
    date: "2026-06-01",
    location: "Denver International Airport",
    country: "USA",
    aircraft: "Boeing 737 MAX 8",
    registration: "N956AN",
    airline: "American Airlines",
    flightNumber: "AA1077",
    severity: "Major",
    status: "Under Investigation",
    causes: ["Mechanical Failure"],
    fatalities: 0,
    injuries: 3,
    occupants: 168,
    summary:
      "During cruise at FL350 from Los Angeles to Chicago, the right engine experienced a catastrophic uncontained failure. The crew declared an emergency and diverted to Denver International Airport where the aircraft landed safely.",
    lat: 39.8561,
    lng: -104.6737,
    departureAirport: "KLAX",
    destinationAirport: "KORD",
    phase: "Cruise",
  },
  {
    id: "INC-2026-0528",
    title: "British Airways 112 Bird Strike on Approach",
    date: "2026-05-28",
    location: "London Heathrow Airport",
    country: "UK",
    aircraft: "Airbus A380-800",
    registration: "G-XLEA",
    airline: "British Airways",
    flightNumber: "BA112",
    severity: "Minor",
    status: "Final Report",
    causes: ["Bird Strike"],
    fatalities: 0,
    injuries: 0,
    occupants: 469,
    summary:
      "An Airbus A380 operating from New York JFK struck a large flock of Canada Geese on approach to Heathrow runway 27L.",
    lat: 51.477,
    lng: -0.4543,
    departureAirport: "KJFK",
    destinationAirport: "EGLL",
    phase: "Approach",
  },
  {
    id: "INC-2026-0525",
    title: "Cessna 172 Engine Failure — Forced Landing",
    date: "2026-05-25",
    location: "Mesa Gateway Airport, Arizona",
    country: "USA",
    aircraft: "Cessna 172S Skyhawk",
    registration: "N4582T",
    airline: "Private",
    flightNumber: "N/A",
    severity: "Moderate",
    status: "Preliminary Report",
    causes: ["Mechanical Failure", "Maintenance"],
    fatalities: 0,
    injuries: 1,
    occupants: 2,
    summary:
      "A privately operated Cessna 172S experienced total engine failure at 4,500 ft AGL. The pilot executed a forced landing in an agricultural field.",
    lat: 33.3078,
    lng: -111.6548,
    departureAirport: "KIWA",
    destinationAirport: "KPRC",
    phase: "Cruise",
  },
  {
    id: "INC-2026-0520",
    title: "Air Canada Express 8709 Severe Turbulence Event",
    date: "2026-05-20",
    location: "En Route — Lake Erie Region",
    country: "Canada",
    aircraft: "Bombardier CRJ-900",
    registration: "C-FLJZ",
    airline: "Air Canada Express",
    flightNumber: "AC8709",
    severity: "Moderate",
    status: "Final Report",
    causes: ["Weather"],
    fatalities: 0,
    injuries: 7,
    occupants: 74,
    summary:
      "Encountered Clear Air Turbulence (CAT) while operating at FL370. The aircraft experienced a rapid altitude deviation of 300 feet.",
    lat: 42.2,
    lng: -81.4,
    departureAirport: "CYYZ",
    destinationAirport: "KBOS",
    phase: "Cruise",
  },
  {
    id: "INC-2026-0515",
    title: "LATAM 540 Landing Gear Retraction Failure",
    date: "2026-05-15",
    location: "São Paulo Guarulhos Airport",
    country: "Brazil",
    aircraft: "Embraer E195-E2",
    registration: "PR-ZIK",
    airline: "LATAM Brasil",
    flightNumber: "LA540",
    severity: "Major",
    status: "Under Investigation",
    causes: ["Mechanical Failure"],
    fatalities: 0,
    injuries: 0,
    occupants: 132,
    summary:
      "The crew reported failure of the left main landing gear to retract following departure. After multiple recycle attempts, the crew declared a MAYDAY.",
    lat: -23.4356,
    lng: -46.4731,
    departureAirport: "SBGR",
    destinationAirport: "SBRJ",
    phase: "Initial Climb",
  },
  {
    id: "INC-2026-0510",
    title: "Air New Zealand 108 Fuel System Anomaly",
    date: "2026-05-10",
    location: "Auckland International Airport",
    country: "New Zealand",
    aircraft: "ATR 72-600",
    registration: "ZK-MVB",
    airline: "Air New Zealand",
    flightNumber: "NZ108",
    severity: "Moderate",
    status: "Preliminary Report",
    causes: ["Fuel Issues"],
    fatalities: 0,
    injuries: 0,
    occupants: 68,
    summary:
      "During pre-departure checks at Auckland, the crew noticed a significant fuel imbalance between the left and right wing tanks.",
    lat: -37.0082,
    lng: 174.785,
    departureAirport: "NZAA",
    destinationAirport: "NZWN",
    phase: "Pre-flight",
  },
  {
    id: "INC-2026-0505",
    title: "Ryanair 4421 Runway Excursion",
    date: "2026-05-05",
    location: "Lisbon Humberto Delgado Airport",
    country: "Portugal",
    aircraft: "Boeing 737-8200 MAX",
    registration: "EI-HGE",
    airline: "Ryanair",
    flightNumber: "FR4421",
    severity: "Major",
    status: "Under Investigation",
    causes: ["Pilot Error", "Weather"],
    fatalities: 0,
    injuries: 12,
    occupants: 189,
    summary:
      "While landing on runway 03 in low-visibility conditions with strong crosswinds, the aircraft touched down approximately 800 meters beyond the threshold.",
    lat: 38.7813,
    lng: -9.1359,
    departureAirport: "EIDW",
    destinationAirport: "LPPT",
    phase: "Landing",
  },
  {
    id: "INC-2026-0428",
    title: "IndiGo 6E 453 CFIT Avoided — GPWS Activation",
    date: "2026-04-28",
    location: "Thiruvananthapuram International Airport",
    country: "India",
    aircraft: "Airbus A320neo",
    registration: "VT-ITH",
    airline: "IndiGo",
    flightNumber: "6E453",
    severity: "Major",
    status: "Final Report",
    causes: ["ATC Error", "Pilot Error"],
    fatalities: 0,
    injuries: 2,
    occupants: 176,
    summary:
      "During an instrument approach in deteriorating weather conditions, the crew received conflicting instructions and followed an incorrect descent profile.",
    lat: 8.4821,
    lng: 76.9199,
    departureAirport: "VOMM",
    destinationAirport: "VOTV",
    phase: "Approach",
  },
  {
    id: "INC-2026-0415",
    title: "Ethiopian Airlines 613 Smoke in Cabin",
    date: "2026-04-15",
    location: "Addis Ababa Bole Airport",
    country: "Ethiopia",
    aircraft: "Boeing 787-9 Dreamliner",
    registration: "ET-AZH",
    airline: "Ethiopian Airlines",
    flightNumber: "ET613",
    severity: "Moderate",
    status: "Final Report",
    causes: ["Maintenance", "Mechanical Failure"],
    fatalities: 0,
    injuries: 0,
    occupants: 241,
    summary:
      "Approximately 90 minutes after departure, the crew received smoke warnings in the forward cargo hold. The source was identified as a lithium battery.",
    lat: 8.9779,
    lng: 38.7993,
    departureAirport: "HAAB",
    destinationAirport: "OMDB",
    phase: "Cruise",
  },
  {
    id: "INC-2026-0402",
    title: "Southwest 2291 Pressurization Loss",
    date: "2026-04-02",
    location: "Denver, Colorado (En Route)",
    country: "USA",
    aircraft: "Boeing 737-700",
    registration: "N737MX",
    airline: "Southwest Airlines",
    flightNumber: "WN2291",
    severity: "Major",
    status: "Final Report",
    causes: ["Mechanical Failure"],
    fatalities: 0,
    injuries: 4,
    occupants: 143,
    summary:
      "At FL390 the cabin altitude warning activated and oxygen masks deployed. The crew executed an emergency descent to 10,000 ft.",
    lat: 39.7392,
    lng: -104.9903,
    departureAirport: "KLAS",
    destinationAirport: "KDEN",
    phase: "Cruise",
  },
  {
    id: "INC-2026-0320",
    title: "Wizz Air 4521 Unstabilized Approach",
    date: "2026-03-20",
    location: "Budapest Ferenc Liszt Airport",
    country: "Hungary",
    aircraft: "Airbus A321neo",
    registration: "HA-LWQ",
    airline: "Wizz Air",
    flightNumber: "W64521",
    severity: "Minor",
    status: "Final Report",
    causes: ["Pilot Error"],
    fatalities: 0,
    injuries: 0,
    occupants: 210,
    summary:
      "ATC recordings and FDR data confirmed the crew continued an unstabilized approach below the stabilization gate altitude.",
    lat: 47.439,
    lng: 19.2615,
    departureAirport: "LOWW",
    destinationAirport: "LHBP",
    phase: "Approach",
  },
  {
    id: "INC-2026-0308",
    title: "Qantas 19 Engine Surge — ETOPS Diversion",
    date: "2026-03-08",
    location: "Nadi International Airport, Fiji",
    country: "Fiji",
    aircraft: "Airbus A350-900",
    registration: "VH-ZNA",
    airline: "Qantas",
    flightNumber: "QF19",
    severity: "Major",
    status: "Under Investigation",
    causes: ["Mechanical Failure"],
    fatalities: 0,
    injuries: 0,
    occupants: 296,
    summary:
      "During an ultra-long-range flight, the No. 1 engine experienced multiple compressor surge events. The crew shut down the engine and diverted to Nadi.",
    lat: -17.7554,
    lng: 177.4431,
    departureAirport: "YSSY",
    destinationAirport: "EGLL",
    phase: "Cruise",
  },
]

export const causeCategories: {
  name: Cause
  count: number
  color: string
  icon: LucideIcon
}[] = [
  { name: "Pilot Error", count: 1247, color: "#EF4444", icon: AlertTriangle },
  { name: "Weather", count: 892, color: "#3B82F6", icon: Cloud },
  { name: "Mechanical Failure", count: 1056, color: "#8B5CF6", icon: Wrench },
  { name: "Bird Strike", count: 423, color: "#10B981", icon: Bird },
  { name: "Fuel Issues", count: 267, color: "#F59E0B", icon: Fuel },
  { name: "Maintenance", count: 534, color: "#06B6D4", icon: Wrench },
  { name: "ATC Error", count: 189, color: "#EC4899", icon: Radio },
]

export const heroStats = [
  { value: "4,608", label: "Total Investigations", sub: "All time" },
  { value: "178", label: "Countries", sub: "Worldwide coverage" },
  { value: "98.7%", label: "Commercial Safety Rate", sub: "IATA 2025" },
  { value: "< 48h", label: "Report Indexing", sub: "After NTSB publication" },
] as const

export const quickTags = [
  "Boeing 737 MAX",
  "Bird Strike",
  "NTSB",
  "Fuel Exhaustion",
  "CFIT",
] as const

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Investigations", href: "/investigations" },
  { label: "Live Map", href: "/map" },
  { label: "Statistics", href: "/statistics" },
] as const

export const footerColumns = [
  {
    title: "Platform",
    links: [
      { label: "Investigations", href: "#" },
      { label: "Map", href: "#" },
      { label: "Statistics", href: "#" },
    ],
  },
  {
    title: "Data Sources",
    links: [
      { label: "NTSB", href: "#" },
      { label: "AAIB", href: "#" },
      { label: "ATSB", href: "#" },
      { label: "BEA", href: "#" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Methodology", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
] as const
