"use client"

import { Activity, Plane, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { FadeIn } from "@/components/ui/FadeIn"

interface InsightCard {
  icon: LucideIcon
  color: string
  title: string
  body: string
}

const insightCards: InsightCard[] = [
  {
    icon: TrendingDown,
    color: "#10B981",
    title: "Sustained Safety Improvement",
    body: "Fatal events decreased by 37% over the past 5 years despite a 28% increase in global flight operations, driven by enhanced FOQA programs and mandatory SMS adoption.",
  },
  {
    icon: Activity,
    color: "#3B82F6",
    title: "Approach Phase Risk",
    body: "Approach and landing phases account for 43% of all incidents despite representing under 5% of flight time. Stabilized approach criteria remain the single most impactful safety lever.",
  },
  {
    icon: Plane,
    color: "#8B5CF6",
    title: "Fleet Modernization Effect",
    body: "Aircraft manufactured after 2015 show a 31% lower incident rate per million departures compared to legacy fleets, reflecting improved TCAS, terrain awareness, and envelope protection systems.",
  },
]

export function InsightCallouts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insightCards.map((card) => {
        const Icon = card.icon
        return (
          <FadeIn key={card.title}>
            <GlassCard hover={false}>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${card.color}14`,
                  border: `1px solid ${card.color}30`,
                }}
              >
                <Icon size={16} style={{ color: card.color }} />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "#E2E8F0",
                  marginBottom: "0.625rem",
                }}
              >
                {card.title}
              </p>
              <p style={{ color: "#64748B", fontSize: "0.8125rem", lineHeight: 1.65 }}>
                {card.body}
              </p>
            </GlassCard>
          </FadeIn>
        )
      })}
    </div>
  )
}
