"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { SectionLabel } from "@/components/ui/SectionLabel"
import { incidents } from "@/lib/landing-data"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const mapReveal = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.15,
    },
  },
}

const markerPop = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.4 + i * 0.08,
      duration: 0.4,
      ease: "backOut" as const,
    },
  }),
}

export function WorldMapPreview() {
  const mapIncidents = incidents.slice(0, 8)

  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <motion.div
        className="mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <SectionLabel
          eyebrow="Global Coverage"
          title="Incident Map"
          subtitle="Real-time incident markers from aviation authorities worldwide"
        />
      </motion.div>

      <motion.div
        className="relative overflow-hidden rounded-2xl"
        style={{
          height: "320px",
          background: "rgba(5,10,25,0.9)",
          border: "1px solid rgba(59,130,246,0.12)",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={mapReveal}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="absolute h-px w-full"
            style={{
              top: `${pct}%`,
              background: "rgba(59,130,246,0.08)",
            }}
          />
        ))}
        {[20, 40, 60, 80].map((pct) => (
          <div
            key={pct}
            className="absolute h-full w-px"
            style={{
              left: `${pct}%`,
              background: "rgba(59,130,246,0.08)",
            }}
          />
        ))}

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 800 320"
          preserveAspectRatio="none"
        >
          <ellipse
            cx="170"
            cy="140"
            rx="90"
            ry="70"
            fill="rgba(59,130,246,0.06)"
            stroke="rgba(59,130,246,0.15)"
            strokeWidth="1"
          />
          <ellipse
            cx="220"
            cy="240"
            rx="45"
            ry="55"
            fill="rgba(59,130,246,0.06)"
            stroke="rgba(59,130,246,0.15)"
            strokeWidth="1"
          />
          <ellipse
            cx="410"
            cy="105"
            rx="50"
            ry="35"
            fill="rgba(59,130,246,0.06)"
            stroke="rgba(59,130,246,0.15)"
            strokeWidth="1"
          />
          <ellipse
            cx="420"
            cy="200"
            rx="55"
            ry="70"
            fill="rgba(59,130,246,0.06)"
            stroke="rgba(59,130,246,0.15)"
            strokeWidth="1"
          />
          <ellipse
            cx="580"
            cy="120"
            rx="110"
            ry="70"
            fill="rgba(59,130,246,0.06)"
            stroke="rgba(59,130,246,0.15)"
            strokeWidth="1"
          />
          <ellipse
            cx="660"
            cy="240"
            rx="55"
            ry="35"
            fill="rgba(59,130,246,0.06)"
            stroke="rgba(59,130,246,0.15)"
            strokeWidth="1"
          />
        </svg>

        {mapIncidents.map((inc, i) => {
          const x = ((inc.lng + 180) / 360) * 100
          const y = ((90 - inc.lat) / 180) * 100
          const color =
            inc.severity === "Fatal"
              ? "#EF4444"
              : inc.severity === "Major"
                ? "#F97316"
                : inc.severity === "Moderate"
                  ? "#F59E0B"
                  : "#10B981"
          return (
            <motion.div
              key={inc.id}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%,-50%)",
              }}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={markerPop}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 animate-ping rounded-full"
                  style={{
                    background: color,
                    opacity: 0.4,
                    width: 10,
                    height: 10,
                  }}
                />
                <div
                  className="h-2.5 w-2.5 rounded-full border border-white/40 shadow-lg"
                  style={{
                    background: color,
                    boxShadow: `0 0 8px ${color}`,
                  }}
                />
              </div>
            </motion.div>
          )
        })}

        <motion.div
          className="absolute bottom-4 left-5 flex items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {(
            [
              ["Fatal/Major", "#EF4444"],
              ["Moderate", "#F59E0B"],
              ["Minor", "#10B981"],
            ] as const
          ).map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: color }}
              />
              <span
                className="mono"
                style={{ color: "#64748B", fontSize: "0.65rem" }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="absolute right-5 top-4"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/map"
            className="mono flex items-center gap-1.5 transition-colors hover:text-white"
            style={{ color: "#3B82F6", fontSize: "0.72rem" }}
          >
            Open Live Map <ArrowRight size={11} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
