"use client"

import { motion } from "framer-motion"

import { footerColumns } from "@/lib/landing-data"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export function SiteFooter() {
  return (
    <motion.footer
      className="mt-8 border-t"
      style={{ borderColor: "rgba(59,130,246,0.08)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <motion.div variants={fadeUp}>
            <div
              className="mb-2 flex items-center gap-2"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "1.0625rem",
                color: "#E2E8F0",
              }}
            >
              <span>&#9992;</span> FlightIQ
            </div>
            <p
              className="mono"
              style={{ color: "#475569", fontSize: "0.72rem" }}
            >
              Aviation intelligence, incident analysis, global coverage.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-8"
            variants={stagger}
          >
            {footerColumns.map((col) => (
              <motion.div key={col.title} variants={fadeUp}>
                <div
                  className="mono mb-3"
                  style={{
                    color: "#3B82F6",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {col.title}
                </div>
                {col.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="mb-2 block transition-colors hover:text-slate-300"
                    style={{
                      color: "#475569",
                      fontSize: "0.875rem",
                    }}
                  >
                    {l.label}
                  </a>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mono mt-10 border-t pt-6"
          style={{
            borderColor: "rgba(59,130,246,0.06)",
            color: "#334155",
            fontSize: "0.7rem",
            letterSpacing: "0.04em",
          }}
          variants={fadeUp}
        >
          &copy; 2026 FlightIQ &middot; Not an official aviation authority
          &middot; Data sourced from public investigation records
        </motion.div>
      </div>
    </motion.footer>
  )
}
