'use client'

import { useState } from 'react'
import { NavSidebar } from '@/components/nav-sidebar'
import { MobileNav } from '@/components/mobile-nav'
import { MobileTopbar } from '@/components/mobile-topbar'
import { FeedManager } from '@/components/admin/feed-manager'
import { PortfolioManager } from '@/components/admin/portfolio-manager'
import { Database, Rss, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'feed', label: 'Feed Posts', icon: Rss },
  { id: 'portfolio', label: 'Projects', icon: Briefcase },
] as const

type TabId = typeof TABS[number]['id']

export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState<TabId>('feed')

  return (
    <div className="flex min-h-screen max-w-[1280px] mx-auto">
      <NavSidebar />

      <main className="flex-1 min-w-0">
        <MobileTopbar />

        {/* Page header */}
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#f4a29520' }}
          >
            <Database size={18} style={{ color: '#f4a295' }} />
          </div>
          <div>
            <h1 className="font-bold text-base text-foreground leading-tight">Data Management</h1>
            <p className="text-xs text-muted-foreground">Manage all your portfolio content</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-0 border-b border-border px-5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-2 py-3.5 px-1 mr-6 text-sm font-semibold border-b-2 transition-colors',
                activeTab === id
                  ? 'border-[#f4a295] text-[#f4a295]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 max-w-3xl">
          {activeTab === 'feed' && <FeedManager />}
          {activeTab === 'portfolio' && <PortfolioManager />}
        </div>

        <div className="h-20 md:hidden" />
      </main>

      <MobileNav />
    </div>
  )
}
