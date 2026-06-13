import type { Cause, Severity, Status } from "@/lib/landing-data"

const severityConfig: Record<
  Severity,
  { label: string; color: string; bg: string; border: string }
> = {
  Fatal: {
    label: "Fatal",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.25)",
  },
  Major: {
    label: "Major",
    color: "#F97316",
    bg: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.25)",
  },
  Moderate: {
    label: "Moderate",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
  },
  Minor: {
    label: "Minor",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
  },
}

const statusConfig: Record<
  Status,
  { color: string; bg: string; border: string }
> = {
  "Under Investigation": {
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.25)",
  },
  "Preliminary Report": {
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.25)",
  },
  "Final Report": {
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
  },
  Closed: {
    color: "#475569",
    bg: "rgba(71,85,105,0.12)",
    border: "rgba(71,85,105,0.25)",
  },
}

function Badge({
  value,
  color,
  bg,
  border,
}: {
  value: string
  color: string
  bg: string
  border: string
}) {
  return (
    <span
      className="mono inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{
        color,
        background: bg,
        border: `1px solid ${border}`,
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
      }}
    >
      {value}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const c = severityConfig[severity]
  return <Badge value={c.label} color={c.color} bg={c.bg} border={c.border} />
}

export function StatusBadge({ status }: { status: Status }) {
  const c = statusConfig[status]
  const dot = status === "Under Investigation"
  return (
    <span
      className="mono inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{
        color: c.color,
        background: c.bg,
        border: `1px solid ${c.border}`,
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
      }}
    >
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: c.color }}
        />
      )}
      {status}
    </span>
  )
}

export function CauseBadge({ cause }: { cause: Cause | string }) {
  return (
    <span
      className="mono inline-flex items-center rounded-md px-2.5 py-1"
      style={{
        color: "#94A3B8",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        fontSize: "0.7rem",
        fontWeight: 500,
      }}
    >
      {cause}
    </span>
  )
}
