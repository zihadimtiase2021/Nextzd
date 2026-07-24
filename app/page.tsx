'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/page-shell'
import { ProfileHero } from '@/components/profile-hero'
import { FeedItem } from '@/components/feed-item'

interface FeedItemData {
  id: string
  type: string
  title: string
  excerpt: string
  content: string
  category: string
  image?: string
  author: string
  clientName?: string
  clientRole?: string
  clientImage?: string
  date: string
  likes: number
  replies: number
  rating?: number
  tech?: string[]
  link?: string
  featured?: boolean
  linkedProjectId?: string
}

export default function HomePage() {
  const router = useRouter()
  const [items, setItems] = useState<FeedItemData[]>([])
  const [filteredItems, setFilteredItems] = useState<FeedItemData[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedItems()
  }, [])

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredItems(items)
    } else {
      setFilteredItems(items.filter((item) => item.category === activeFilter))
    }
  }, [activeFilter, items])

  function handleFilterChange(value: string) {
    setActiveFilter(value)
    // Also navigate to the category route so browser URL reflects the filter
    if (value === 'all') {
      router.push('/', { scroll: false })
    } else {
      router.push(`/feed/category/${value}`, { scroll: false })
    }
  }

  async function fetchFeedItems() {
    try {
      const res = await fetch('/api/feed')
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      {/* Profile hero contains the single filter tab bar */}
      <ProfileHero activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      {/* Feed */}
      <section aria-label="Feed">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse rounded-2xl bg-muted h-32" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">📭</span>
            </div>
            <p className="text-sm text-muted-foreground">No posts in this category yet.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <FeedItem
              key={item.id}
              id={item.id}
              type={item.type as 'article' | 'testimonial' | 'project'}
              title={item.title}
              body={item.type === 'testimonial' ? item.content : item.excerpt}
              author={item.type === 'testimonial' ? (item.clientName ?? item.author) : item.author}
              authorRole={item.type === 'testimonial' ? item.clientRole : undefined}
              date={item.date}
              initialLikes={item.likes}
              replies={item.replies}
              rating={item.rating}
              image={item.image}
              clientImage={item.clientImage}
              projectTech={item.tech}
              projectLink={item.link}
              linkedProjectId={item.linkedProjectId}
            />
          ))
        )}
      </section>
    </PageShell>
  )
}
