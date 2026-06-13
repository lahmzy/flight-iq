interface SectionLabelProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
}

export function SectionLabel({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionLabelProps) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p
          className="mono mb-3"
          style={{
            color: "#3B82F6",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="text-2xl font-semibold tracking-tight sm:text-3xl"
        style={{
          fontFamily: "var(--font-heading)",
          color: "#E2E8F0",
          marginBottom: subtitle ? "0.75rem" : 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            color: "#94A3B8",
            fontSize: "1rem",
            lineHeight: 1.6,
            maxWidth: align === "center" ? "560px" : undefined,
            margin: align === "center" ? "0 auto" : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
