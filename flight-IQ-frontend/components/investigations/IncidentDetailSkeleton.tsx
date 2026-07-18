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

export function IncidentDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header skeleton */}
      <div className="mb-10 space-y-4">
        <div className="flex gap-2">
          <PulseBar w="w-20" h="h-6" />
          <PulseBar w="w-28" h="h-6" />
          <PulseBar w="w-36" h="h-5" />
        </div>
        <PulseBar w="w-2/3" h="h-10" />
        <div className="flex gap-6">
          <PulseBar w="w-40" h="h-4" />
          <PulseBar w="w-36" h="h-4" />
          <PulseBar w="w-32" h="h-4" />
        </div>
      </div>

      {/* Body grid skeleton */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Main column */}
        <div className="space-y-8 xl:col-span-2">
          <GlassCard hover={false}>
            <PulseBar w="w-40" h="h-5" />
            <div className="mt-4 space-y-2">
              <PulseBar />
              <PulseBar />
              <PulseBar w="w-5/6" />
              <PulseBar />
              <PulseBar w="w-4/6" />
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <PulseBar w="w-36" h="h-5" />
            <div className="mt-6 flex items-center gap-4">
              <PulseBar w="w-20" h="h-12" />
              <div className="flex-1">
                <PulseBar h="h-1" />
              </div>
              <PulseBar w="w-20" h="h-12" />
            </div>
          </GlassCard>

          <PulseBlock h="h-48" />
        </div>

        {/* Aside column */}
        <div className="space-y-6">
          <PulseBlock h="h-44" />
          <PulseBlock h="h-32" />
          <PulseBlock h="h-36" />
        </div>
      </div>
    </div>
  )
}
