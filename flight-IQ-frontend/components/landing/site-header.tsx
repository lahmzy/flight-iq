import { Bell, Plane, Search, Settings } from "lucide-react"

import { Input } from "@/components/ui/input"
import { navLinks } from "@/lib/landing-data"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
        >
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
            <Plane className="size-4 text-primary" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">
            FlightIQ
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-widest",
                "text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="relative ml-auto hidden flex-1 max-w-xs md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search investigations…"
            className="h-8 border-border/50 bg-background/50 pl-8 text-xs rounded-xl"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </button>
          <div className="ml-1 flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-primary/10 text-[10px] font-semibold text-primary ring-1 ring-primary/30">
            JY
          </div>
        </div>
      </div>
    </header>
  )
}
