import { CauseTaxonomy } from "@/components/landing/CauseTaxonomy"
import { CriticalInvestigations } from "@/components/landing/CriticalInvestigations"
import { HeroSection } from "@/components/landing/HeroSection"
import { SiteFooter } from "@/components/landing/SiteFooter"
import { SiteHeader } from "@/components/landing/SiteHeader"
import { StatsBar } from "@/components/landing/StatsBar"
import { WorldMapPreview } from "@/components/landing/WorldMapPreview"
import { GridOverlay } from "@/components/layout/GridOverlay"
import { MouseGlow } from "@/components/layout/MouseGlow"

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <GridOverlay />
      <MouseGlow />
      <div
        className="pointer-events-none fixed top-0 left-1/4 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
          zIndex: 1,
        }}
      />
      <div
        className="pointer-events-none fixed right-1/4 bottom-0 h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)",
          filter: "blur(40px)",
          zIndex: 1,
        }}
      />
      <SiteHeader />
      <main className="relative z-20" style={{ paddingTop: "64px" }}>
        <HeroSection />
        <StatsBar />
        <CauseTaxonomy />
        <CriticalInvestigations />
        <WorldMapPreview />
      </main>
      <SiteFooter />
    </div>
  )
}
