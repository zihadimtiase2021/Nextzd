'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Briefcase, Mail, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/about', icon: User },
  { label: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { label: 'Contact', href: '/contact', icon: Mail },
  { label: 'Manage', href: '/data-management', icon: Database },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all',
                active ? 'text-brand' : 'text-muted-foreground'
              )}
              style={active ? { color: '#f4a295' } : {}}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
