"use client"

import { useEffect, useRef } from "react"

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = glowRef.current
    if (!el) return

    let raf: number
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      el.style.transform = `translate(${currentX - 250}px, ${currentY - 250}px)`
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 z-10 h-[500px] w-[500px] rounded-full"
      style={{
        background:
          "radial-gradient(circle at center, rgba(59,130,246,0.07) 0%, rgba(59,130,246,0.02) 40%, transparent 70%)",
        willChange: "transform",
      }}
    />
  )
}
