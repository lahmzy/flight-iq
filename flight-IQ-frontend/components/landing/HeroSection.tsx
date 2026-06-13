"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Search } from "lucide-react"

import { incidents, quickTags } from "@/lib/landing-data"

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function HeroSection() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/investigations?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-32 md:py-40">
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(59,130,246,0.12) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="flex flex-col items-center"
      >
        <motion.div variants={fadeUp}>
          <div
            className="mono mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2"
            style={{
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "#3B82F6",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
            }}
          >
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            AVIATION INTELLIGENCE PLATFORM — {incidents.length} INVESTIGATIONS
            INDEXED
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mb-6 max-w-4xl text-center"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(2.75rem, 6vw, 5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            background:
              "linear-gradient(180deg, #F1F5F9 30%, rgba(148,163,184,0.7) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Understand Every Aviation Incident. Globally.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mb-12 max-w-xl text-center"
          style={{ color: "#64748B", fontSize: "1.125rem", lineHeight: 1.7 }}
        >
          FlightIQ aggregates worldwide aviation incident reports, investigation
          timelines, and causal analyses from regulators including NTSB, AAIB,
          ATSB, and BEA.
        </motion.p>

        <motion.form
          variants={scaleIn}
          onSubmit={handleSearch}
          className="relative w-full max-w-3xl"
        >
          <div
            className="flex items-center gap-0 overflow-hidden rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_50px_rgba(59,130,246,0.2)]"
            style={{
              background: "rgba(10,16,37,0.9)",
              border: "1px solid rgba(59,130,246,0.18)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex flex-1 items-center gap-3 px-6 py-5">
              <Search
                size={20}
                style={{ color: "#3B82F6", flexShrink: 0 }}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search aircraft type, airline, location, registration, cause…"
                className="flex-1 border-none bg-transparent outline-none"
                style={{ color: "#E2E8F0", fontSize: "1rem" }}
              />
            </div>
            <button
              type="submit"
              className="m-1.5 flex items-center gap-2 rounded-xl px-6 py-3.5 transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.4)]"
              style={{
                background: "#3B82F6",
                color: "#fff",
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
              }}
            >
              Search
              <ArrowRight size={16} />
            </button>
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-4 flex flex-wrap items-center justify-center gap-2"
          >
            <span style={{ color: "#475569", fontSize: "0.8rem" }}>
              Quick:
            </span>
            {quickTags.map((tag, i) => (
              <motion.button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="rounded-lg px-3 py-1.5 transition-all hover:border-blue-500/30 hover:text-slate-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#64748B",
                  fontSize: "0.78rem",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.06, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </motion.form>
      </motion.div>
    </section>
  )
}
