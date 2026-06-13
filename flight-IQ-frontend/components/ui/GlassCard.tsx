"use client"

import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  hover?: boolean
  padding?: string
  onClick?: () => void
}

export function GlassCard({
  children,
  className = "",
  style = {},
  hover = true,
  padding = "p-6",
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl transition-all duration-300",
        padding,
        hover &&
          "cursor-pointer hover:border-[rgba(59,130,246,0.25)] hover:shadow-[0_0_40px_rgba(59,130,246,0.12)]",
        className,
      )}
      style={{
        background: "rgba(10,16,37,0.65)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(59,130,246,0.10)",
        boxShadow:
          "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
