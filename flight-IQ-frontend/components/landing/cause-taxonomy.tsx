import { ArrowUpRight, MoreHorizontal } from "lucide-react"

import { taxonomyCategories } from "@/lib/landing-data"

export function CauseTaxonomy() {
  return (
    <section id="taxonomy" className="relative">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Cause Taxonomy
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Filter global incident databases by primary causal factors. Our
            taxonomy is aligned with ICAO Annex 13 standards for systematic
            classification.
          </p>
        </div>

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border/30 sm:grid-cols-2 lg:grid-cols-4">
          {taxonomyCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <div
                key={cat.title}
                className="group cursor-pointer border-border/30 transition-all duration-200 hover:scale-[1.02] hover:bg-white/[0.04] [&:not(:last-child)]:border-b [&:not(:nth-last-child(-n+4))]:lg:border-b sm:[&:not(:nth-child(2n))]:border-r lg:[&:not(:nth-child(4n))]:border-r"
                style={{
                  backgroundColor: "oklch(0.18 0.03 260 / 0.55)",
                }}
              >
                <div className="flex h-full flex-col gap-3 px-6 py-7">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors duration-200 group-hover:bg-primary/15">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>
                  <div className="mt-auto pt-3 font-mono text-[10px] uppercase tracking-widest text-sky-400">
                    {cat.cases} Cases
                  </div>
                </div>
              </div>
            )
          })}

          <a
            href="#"
            className="group flex h-full min-h-[180px] flex-col items-center justify-center gap-3 border-border/30 p-6 transition-all duration-200 hover:scale-[1.02] hover:bg-white/[0.04]"
            style={{
              backgroundColor: "oklch(0.18 0.03 260 / 0.35)",
            }}
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground ring-1 ring-border">
              <MoreHorizontal className="size-4" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Explore Database
            </span>
            <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
