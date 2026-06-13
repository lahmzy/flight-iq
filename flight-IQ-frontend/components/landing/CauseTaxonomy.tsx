"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { causeCategories } from "@/lib/landing-data"

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const headerFade = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function CauseTaxonomy() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <motion.div
        className="mb-10 flex items-end justify-between"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headerFade}
      >
        <SectionLabel
          eyebrow="Browse by Cause"
          title="Investigation Categories"
          subtitle="Filter the database by primary contributing factor"
        />
        <Link
          href="/investigations"
          className="hidden items-center gap-1.5 transition-colors hover:text-white md:flex"
          style={{ color: "#3B82F6", fontSize: "0.875rem", fontWeight: 500 }}
        >
          View all <ChevronRight size={16} />
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={container}
      >
        {causeCategories.map((cat) => {
          const Icon = cat.icon
          return (
            <motion.div key={cat.name} variants={item} whileHover={{ y: -4 }}>
              <Link
                href={`/investigations?cause=${encodeURIComponent(cat.name)}`}
              >
                <GlassCard
                  className="group h-full"
                  style={{ borderColor: "rgba(59,130,246,0.08)" }}
                >
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-all group-hover:scale-110"
                    style={{
                      background: `${cat.color}18`,
                      border: `1px solid ${cat.color}35`,
                    }}
                  >
                    <Icon size={18} style={{ color: cat.color }} />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      fontSize: "0.975rem",
                      color: "#E2E8F0",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {cat.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      fontSize: "1.25rem",
                      color: cat.color,
                    }}
                  >
                    {cat.count.toLocaleString()}
                  </div>
                  <div
                    className="mono"
                    style={{
                      color: "#475569",
                      fontSize: "0.65rem",
                      marginTop: "0.1rem",
                    }}
                  >
                    investigations
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
