"use client"

import { ArrowRight, Plane } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSearch() {
  return (
    <form
      className="mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-3xl glass-strong p-2 sm:flex-row sm:items-center sm:gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="relative flex flex-1 items-center">
        <Plane className="pointer-events-none absolute left-4 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter Flight ID (e.g. BA117)…"
          className="h-12 border-0 bg-transparent pl-11 text-sm shadow-none focus-visible:ring-0"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-12 gap-2 rounded-2xl px-6 font-mono text-xs uppercase tracking-widest"
      >
        Analyze
        <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}
