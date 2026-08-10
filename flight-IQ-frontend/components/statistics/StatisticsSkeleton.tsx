import { GlassCard } from "@/components/ui/GlassCard"

function PulseBar({ w = "w-full", h = "h-4" }: { w?: string; h?: string }) {
  return (
    <div
      className={`${w} ${h} animate-pulse rounded-lg`}
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  )
}

function PulseBlock({ h = "h-24" }: { h?: string }) {
  return (
    <div
      className={`w-full ${h} animate-pulse rounded-xl`}
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
    />
  )
}

function ChartCardSkeleton({ bars = 8 }: { bars?: number }) {
  return (
    <GlassCard hover={false}>
      <div className="flex items-center justify-between mb-6">
        <PulseBar w="w-44" h="h-5" />
        <PulseBar w="w-24" h="h-4" />
      </div>
      <div className="flex items-end justify-between gap-2 h-40">
        {Array.from({ length: bars }).map((_, i) => (
          <PulseBar
            key={i}
            h={`h-${16 + ((i * 7) % 22)}`}
            w="flex-1"
          />
        ))}
      </div>
    </GlassCard>
  )
}

export function StatisticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GlassCard hover={false} key={i}>
            <div className="space-y-3">
              <PulseBar w="w-8" h="h-8" />
              <PulseBar w="w-28" h="h-4" />
              <PulseBar w="w-24" h="h-8" />
              <PulseBar w="w-36" h="h-3" />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Annual trend */}
      <ChartCardSkeleton bars={13} />

      {/* Three-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PulseBlock h="h-80" />
        <PulseBlock h="h-80" />
        <PulseBlock h="h-80" />
      </div>

      {/* Aircraft charts */}
      <ChartCardSkeleton bars={6} />

      {/* Region breakdown */}
      <PulseBlock h="h-56" />

      {/* Safety trend */}
      <ChartCardSkeleton bars={13} />

      {/* Insight callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <PulseBlock key={i} h="h-40" />
        ))}
      </div>
    </div>
  )
}
