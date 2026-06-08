import { Activity, CircleDot, Radio, Satellite } from "lucide-react"

import { WorldMap } from "@/components/landing/world-map"
import { hubDetailItems, hubStats } from "@/lib/landing-data"

export function GlobalIntelligenceHub() {
  return (
    <section
      id="hub"
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial-glow-soft pointer-events-none" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
            <Activity className="size-3" />
            Global Intelligence Hub
          </div>
          <h2 className="max-w-md text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Aggregating data from{" "}
            <span className="text-primary">40+ international</span> aviation
            authorities.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Providing a real-time global dashboard for forensic investigators
            and safety managers. Every node is verified against ICAO Annex 13
            incident reporting standards.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {hubDetailItems.map((item) => (
              <div
                key={item.label}
                className="glass-strong rounded-2xl px-4 py-3.5"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {item.label === "Active Satellite Feeds" ? (
                    <Satellite className="size-3.5 text-primary" />
                  ) : (
                    <Radio className="size-3.5 text-primary" />
                  )}
                  {item.label}
                </div>
                <div className="mt-1.5 text-lg font-semibold tabular-nums">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-strong relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_40%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
            <div className="relative h-72 sm:h-80 lg:h-96">
              <WorldMap className="relative h-full w-full" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-emerald-400">
                <CircleDot className="size-2.5" />
                Live Telemetry Active
              </div>
              <div className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                GMT 14:32:08
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {hubStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="glass group rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:scale-[1.02] hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      {stat.label}
                    </span>
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon className="size-3.5" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {stat.sub}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}