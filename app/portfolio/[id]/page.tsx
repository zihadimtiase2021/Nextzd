'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Code, TrendingUp, CheckCircle2 } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  category: string
  description: string
  tech: string[]
  results: Record<string, string>
  link?: string
  github?: string
  image?: string
  featured: boolean
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/portfolio/${id}`)
        if (!res.ok) { router.push('/portfolio'); return }
        setProject(await res.json())
      } catch {
        router.push('/portfolio')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  if (loading) {
    return (
      <PageShell>
        <div className="flex flex-col gap-4 p-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse h-8 rounded-xl bg-muted" />
          ))}
        </div>
      </PageShell>
    )
  }

  if (!project) return null

  return (
    <PageShell>
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-bold text-base text-foreground leading-tight line-clamp-1">{project.title}</h1>
          <p className="text-xs text-muted-foreground capitalize">{project.category}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Source code"
            >
              <Code size={15} />
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#f4a295', color: '#1a1a1a' }}
            >
              <ExternalLink size={12} />
              Live site
            </a>
          )}
        </div>
      </div>

      {/* Hero image */}
      {project.image ? (
        <div className="w-full bg-muted overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          className="w-full flex items-center justify-center"
          style={{
            aspectRatio: '16/9',
            background: 'linear-gradient(135deg, #f4a29518 0%, #f4a29508 100%)',
          }}
        >
          <span className="font-bold text-4xl" style={{ color: '#f4a29540' }}>
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}

      <div className="px-5 py-6">
        {/* Category + featured */}
        <div className="flex items-center gap-2 mb-3">
          <Link
            href={`/portfolio/category/${project.category}`}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#f4a29520', color: '#f4a295' }}
          >
            {project.category}
          </Link>
          {project.featured && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-bold text-2xl text-foreground mb-3 text-pretty leading-snug">
          {project.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{project.description}</p>

        {/* Results */}
        <div className="rounded-2xl border border-border bg-card p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} style={{ color: '#f4a295' }} />
            <p className="text-sm font-bold text-foreground">Results</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(project.results).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <CheckCircle2 size={13} style={{ color: '#f4a295' }} className="shrink-0" />
                <span className="text-xs text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-xs font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#f4a295', color: '#1a1a1a' }}
            >
              <ExternalLink size={14} />
              View live site
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold border border-border transition-all hover:bg-muted"
            >
              <Code size={14} />
              Source code
            </a>
          )}
        </div>
      </div>
    </PageShell>
  )
}
