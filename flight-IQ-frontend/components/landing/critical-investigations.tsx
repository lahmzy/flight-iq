import { ArrowUpRight, CircleDot, Clock, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { featuredInvestigation, liveLogs } from "@/lib/landing-data"
import { cn } from "@/lib/utils"

export function CriticalInvestigations() {
  return (
    <section
      id="investigations"
      className="relative bg-grid-lines"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Critical Investigations
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Active forensic analysis of recent aerospace anomalies.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            View All Archives
            <ArrowUpRight className="size-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="glass relative col-span-1 overflow-hidden lg:col-span-2">
            <div className="relative h-64 overflow-hidden sm:h-80">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_30%_50%,rgba(59,130,246,0.4),transparent_60%),radial-gradient(ellipse_40%_60%_at_70%_60%,rgba(14,165,233,0.2),transparent_60%)]" />
              <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.0)_0deg,rgba(59,130,246,0.15)_90deg,rgba(59,130,246,0.0)_180deg,rgba(59,130,246,0.2)_270deg,rgba(59,130,246,0.0)_360deg)] opacity-60" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(5,8,22,0.95)_100%)]" />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {featuredInvestigation.badges.map((badge, i) => (
                  <Badge
                    key={badge}
                    variant={i === 0 ? "destructive" : "secondary"}
                    className="font-mono text-[9px] uppercase tracking-widest"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>

              <div className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                CASE ID {featuredInvestigation.id}
              </div>
            </div>

            <CardContent className="space-y-3 pt-6">
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {featuredInvestigation.title}
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {featuredInvestigation.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  Last ping: {featuredInvestigation.meta.lastPing}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {featuredInvestigation.meta.sector}
                </span>
                <a
                  href="#"
                  className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
                >
                  Open Dossier
                  <ArrowUpRight className="size-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            {liveLogs.map((log) => {
              const Icon = log.icon
              const barColor =
                log.status === "warning"
                  ? "from-orange-500 to-amber-400"
                  : "from-primary to-sky-400"
              return (
                <Card
                  key={log.id}
                  className="glass relative flex-1 overflow-hidden"
                >
                  <CardContent className="flex h-full flex-col gap-4 pt-6">
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "flex size-9 items-center justify-center rounded-xl ring-1",
                          log.status === "warning"
                            ? "bg-orange-500/10 text-orange-400 ring-orange-500/20"
                            : "bg-primary/10 text-primary ring-primary/20"
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {log.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-semibold tracking-tight">
                        {log.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {log.description}
                      </p>
                    </div>

                    <div className="mt-auto space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        <span>Sync</span>
                        <span>{log.progress}%</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-muted/60">
                        <div
                          className={cn(
                            "h-full rounded-full bg-gradient-to-r",
                            barColor
                          )}
                          style={{ width: `${log.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            <div className="flex items-center gap-1.5 px-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              <CircleDot className="size-2.5 animate-pulse text-emerald-400" />
              Live Telemetry Stream
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
