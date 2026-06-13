"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { navLinks } from "@/lib/landing-data"

function PlaneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        fill="currentColor"
      />
    </svg>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50"
      style={{
        background: "rgba(5,8,22,0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(59,130,246,0.08)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.6)]"
            style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
            }}
          >
            <span className="text-white">
              <PlaneIcon />
            </span>
          </div>
          <span
            className="tracking-tight text-white"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "1.125rem",
            }}
          >
            FlightIQ
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-lg px-4 py-2 transition-all duration-200"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: active ? "#E2E8F0" : "#94A3B8",
                  background: active ? "rgba(59,130,246,0.1)" : "transparent",
                }}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-1/2 h-px w-8 -translate-x-1/2 rounded-full"
                    style={{ background: "#3B82F6" }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span
            className="mono rounded px-2 py-1"
            style={{
              color: "#10B981",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              fontSize: "0.7rem",
            }}
          >
            ● LIVE
          </span>
          <Link
            href="/investigations"
            className="rounded-lg px-4 py-2 transition-all duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            style={{
              background: "#3B82F6",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: "var(--font-heading)",
            }}
          >
            Explore Database
          </Link>
        </div>

        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="block h-px w-5 bg-gray-400" />
          <span className="block h-px w-5 bg-gray-400" />
          <span className="block h-px w-3 bg-gray-400" />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="border-t md:hidden"
          style={{
            borderColor: "rgba(59,130,246,0.08)",
            background: "rgba(5,8,22,0.98)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-4 transition-colors"
              style={{
                color: pathname === link.href ? "#3B82F6" : "#94A3B8",
                fontSize: "0.9375rem",
                borderBottom: "1px solid rgba(59,130,246,0.05)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
