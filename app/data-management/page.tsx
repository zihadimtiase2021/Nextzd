'use client'

import { useState } from 'react'
import { NavSidebar } from '@/components/nav-sidebar'
import { MobileNav } from '@/components/mobile-nav'
import { MobileTopbar } from '@/components/mobile-topbar'
import { FeedManager } from '@/components/admin/feed-manager'
import { PortfolioManager } from '@/components/admin/portfolio-manager'
import { SiteSettingsManager } from '@/components/admin/site-settings-manager'
import { Database, Rss, Briefcase, Settings2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTIONS = [
  {
    id: 'feed',
    label: 'Feed Posts',
    description: 'Articles, testimonials & project posts',
    icon: Rss,
    accent: '#f4a295',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    description: 'Projects with gallery & rich content',
    icon: Briefcase,
    accent: '#9db8e8',
  },
  {
    id: 'settings',
    label: 'Site Settings',
    description: 'Hero & about page media',
    icon: Settings2,
    accent: '#a8d5c2',
  },
] as const

type SectionId = typeof SECTIONS[number]['id']

export default function DataManagementPage() {
  const [active, setActive] = useState<SectionId>('feed')

  const current = SECTIONS.find((s) => s.id === active)!

  return (
    <div className="flex min-h-screen max-w-[1280px] mx-auto">
      <NavSidebar />

      <main className="flex-1 min-w-0 flex flex-col">
        <MobileTopbar />

        {/* ── Page header ────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#f4a29520' }}
          >
            <Database size={18} style={{ color: '#f4a295' }} />
          </div>
          <div>
            <h1 className="font-bold text-base text-foreground leading-tight">Data Management</h1>
            <p className="text-xs text-muted-foreground">Manage all portfolio content &amp; site settings</p>
          </div>
        </div>

        {/* ── Body: nav sidebar + content ────────────────────────── */}
        <div className="flex flex-1 min-h-0">

          {/* Left nav — visible on md+ */}
          <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border py-4 px-3 gap-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1">
              Sections
            </p>
            {SECTIONS.map(({ id, label, description, icon: Icon, accent }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left transition-all',
                    isActive ? 'bg-muted' : 'hover:bg-muted/50'
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: isActive ? accent + '25' : 'transparent',
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: isActive ? accent : 'var(--muted-foreground)' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-semibold leading-tight truncate',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                      style={isActive ? { color: accent } : {}}
                    >
                      {label}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 leading-tight mt-0.5 truncate">
                      {description}
                    </p>
                  </div>
                  {isActive && (
                    <ChevronRight size={13} style={{ color: accent, flexShrink: 0 }} />
                  )}
                </button>
              )
            })}
          </aside>

          {/* Mobile tab strip */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 z-20 flex bg-background/95 backdrop-blur border-t border-border px-2 py-1.5 gap-1">
            {SECTIONS.map(({ id, label, icon: Icon, accent }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-all',
                    isActive ? '' : 'opacity-60'
                  )}
                >
                  <Icon size={17} style={{ color: isActive ? accent : 'var(--muted-foreground)' }} />
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: isActive ? accent : 'var(--muted-foreground)' }}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Content pane */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            {/* Section heading strip */}
            <div
              className="flex items-center gap-3 px-5 py-4 border-b border-border"
              style={{ background: current.accent + '08' }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: current.accent + '20' }}
              >
                <current.icon size={16} style={{ color: current.accent }} />
              </div>
              <div>
                <h2 className="font-bold text-sm text-foreground">{current.label}</h2>
                <p className="text-[11px] text-muted-foreground">{current.description}</p>
              </div>
            </div>

            <div className="p-5 max-w-3xl">
              {active === 'feed' && <FeedManager />}
              {active === 'portfolio' && <PortfolioManager />}
              {active === 'settings' && <SiteSettingsManager />}
            </div>

            <div className="h-28 md:h-8" />
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
