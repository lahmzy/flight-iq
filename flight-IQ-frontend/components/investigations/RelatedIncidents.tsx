"use client"

import { Loader2 } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { InvestigationCard } from "@/components/investigations/InvestigationCard"
import { useGetRequest } from "@/hooks/useGetRequest"
import type { BackendApiResponse } from "@/types/api"
import type { BackendIncidentList, BackendSeverity } from "@/types/incident"
import { mapBackendIncidentToDisplay } from "@/lib/incident-display"

interface RelatedIncidentsProps {
  currentSlug: string
  severity: BackendSeverity
  country?: string | null
}

export function RelatedIncidents({ currentSlug, severity, country }: RelatedIncidentsProps) {
  const params = new URLSearchParams({ limit: "4", severity })
  if (country) params.set("country", country)

  const { data, isLoading } = useGetRequest<BackendApiResponse<BackendIncidentList>>({
    url: `/incidents?${params.toString()}`,
    queryKey: ["related-incidents", currentSlug, severity, country],
  })

  const incidents =
    data?.data?.data
      ?.filter((i) => i.slug !== currentSlug)
      .slice(0, 3)
      .map(mapBackendIncidentToDisplay) ?? []

  if (!isLoading && incidents.length === 0) return null

  return (
    <GlassCard hover={false}>
      <div className="mb-5">
        <SectionLabel eyebrow="Similar Incidents" title="Related Investigations" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin" style={{ color: "#3B82F6" }} />
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <InvestigationCard key={inc.id} incident={inc} />
          ))}
        </div>
      )}
    </GlassCard>
  )
}
