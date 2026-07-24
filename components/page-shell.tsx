import { NavSidebar } from '@/components/nav-sidebar'
import { InfoSidebar } from '@/components/info-sidebar'
import { MobileNav } from '@/components/mobile-nav'
import { MobileTopbar } from '@/components/mobile-topbar'

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen max-w-[1280px] mx-auto">
      <NavSidebar />

      {/* Main column */}
      <main className="flex-1 min-w-0 border-r border-border">
        <MobileTopbar />
        {children}
        {/* spacer for mobile bottom nav */}
        <div className="h-20 md:hidden" />
      </main>

      <InfoSidebar />
      <MobileNav />
    </div>
  )
}
