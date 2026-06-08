import { CauseTaxonomy } from "@/components/landing/cause-taxonomy"
import { CriticalInvestigations } from "@/components/landing/critical-investigations"
import { GlobalIntelligenceHub } from "@/components/landing/global-intelligence-hub"
import { HeroSection } from "@/components/landing/hero-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <CriticalInvestigations />
        <CauseTaxonomy />
        <GlobalIntelligenceHub />
      </main>
      <SiteFooter />
    </div>
  )
}
