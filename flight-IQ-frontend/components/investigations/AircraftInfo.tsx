import { Plane } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import type { BackendIncidentDetail } from "@/types/incident"

interface RowItem {
  label: string
  value: string
}

export function AircraftInfo({ incident }: { incident: BackendIncidentDetail }) {
  const primary = incident.aircraft.find((a) => a.isPrimary) ?? incident.aircraft[0]
  const ac = primary?.aircraft

  if (!ac) {
    return (
      <GlassCard hover={false}>
        <div className="mb-5 flex items-center gap-2">
          <Plane size={15} style={{ color: "#3B82F6" }} />
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "#E2E8F0",
            }}
          >
            Aircraft
          </span>
        </div>
        <p className="mono" style={{ color: "#475569", fontSize: "0.8rem" }}>
          No aircraft data available for this record.
        </p>
      </GlassCard>
    )
  }

  // Build the type string from make/model/series
  const typeParts = [ac.make, ac.model, ac.series].filter(Boolean)
  const typeStr = typeParts.length > 0 ? typeParts.join(" ") : null

  const rows: RowItem[] = [
    typeStr ? { label: "Type", value: typeStr } : null,
    ac.registrationNo ? { label: "Registration", value: ac.registrationNo } : null,
    ac.operatorName ? { label: "Operator", value: ac.operatorName } : null,
    ac.flightNumber ? { label: "Flight", value: ac.flightNumber } : null,
    ac.ntsbCategory ? { label: "Category", value: ac.ntsbCategory } : null,
    ac.homebuilt ? { label: "Homebuilt", value: "Yes" } : null,
  ].filter((r): r is RowItem => r !== null)

  return (
    <GlassCard hover={false}>
      <div className="mb-5 flex items-center gap-2">
        <Plane size={15} style={{ color: "#3B82F6" }} />
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "#E2E8F0",
          }}
        >
          Aircraft
        </span>
      </div>

      {rows.length > 0 ? (
        <div className="space-y-3">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-3">
              <span className="mono flex-shrink-0" style={{ color: "#475569", fontSize: "0.72rem" }}>
                {label}
              </span>
              <span
                className="mono text-right"
                style={{ color: "#E2E8F0", fontSize: "0.78rem", fontWeight: 600 }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mono" style={{ color: "#475569", fontSize: "0.8rem" }}>
          Aircraft details not recorded.
        </p>
      )}
    </GlassCard>
  )
}
