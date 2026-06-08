import { Separator } from "@/components/ui/separator"
import { HeroSearch } from "@/components/landing/hero-search"
import { heroStats } from "@/lib/landing-data"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-grid-lines"
    >
      <div className="perspective-grid" />
      <div className="bg-radial-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Aerospace Forensics Suite
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Precision Intelligence for{" "}
            <span className="text-primary">Flight Incident Analytics.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Aggregate telemetry, forensic telemetry, and open-source
            intelligence across global airspace. Built for investigators,
            analysts, and safety teams.
          </p>

          <HeroSearch />

          <dl className="mt-16 flex w-full max-w-3xl items-center justify-center divide-x divide-border/50">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-1 flex-col items-center gap-2 px-4 first:pl-0 last:pr-0"
              >
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <Separator className="mx-auto max-w-6xl bg-border/30" />
    </section>
  )
}
