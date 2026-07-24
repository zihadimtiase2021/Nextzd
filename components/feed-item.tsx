'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, BookOpen, Quote, Briefcase, TrendingUp, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

type FeedType = 'article' | 'testimonial' | 'project'

interface FeedItemProps {
  id?: string
  type: FeedType
  title?: string
  body: string
  author?: string
  authorRole?: string
  date: string
  tag?: string
  initialLikes?: number
  replies?: number
  rating?: number
  projectTech?: string[]
  projectLink?: string
  image?: string
  clientImage?: string
  linkedProjectId?: string
}

const TYPE_META: Record<FeedType, { label: string; icon: React.ElementType; color: string }> = {
  article: { label: 'Article', icon: BookOpen, color: '#f4a295' },
  testimonial: { label: 'Testimonial', icon: Quote, color: '#a8d5c2' },
  project: { label: 'Project', icon: Briefcase, color: '#9db8e8' },
}

export function FeedItem({
  id,
  type,
  title,
  body,
  author,
  authorRole,
  date,
  tag,
  initialLikes = 0,
  replies = 0,
  rating,
  projectTech = [],
  projectLink,
  image,
  clientImage,
  linkedProjectId,
}: FeedItemProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const meta = TYPE_META[type]
  const TypeIcon = meta.icon
  const detailHref = id ? `/feed/${id}` : undefined

  function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setLiked((prev) => !prev)
    setLikes((prev) => (liked ? prev - 1 : prev + 1))
  }

  function handleShare(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share && detailHref) {
      navigator.share({ title: title ?? 'Zihad Imtiase', url: window.location.origin + detailHref })
    }
  }

  const inner = (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
        style={{ backgroundColor: '#f4a295', color: '#1a1a1a' }}
      >
        {(author || 'Z').slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        {/* Author + date */}
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="font-semibold text-sm text-foreground">{author || 'Zihad Imtiase'}</span>
          {authorRole && <span className="text-xs text-muted-foreground">{authorRole}</span>}
          <span className="text-xs text-muted-foreground ml-auto shrink-0">{date}</span>
        </div>

        {/* Type badge */}
        <div className="flex items-center gap-1.5 mb-3">
          <TypeIcon size={11} style={{ color: meta.color }} />
          <span className="text-[11px] font-medium" style={{ color: meta.color }}>{meta.label}</span>
          {tag && (
            <>
              <span className="text-muted-foreground text-[11px]">·</span>
              <span className="text-[11px] text-muted-foreground">#{tag}</span>
            </>
          )}
        </div>

        {/* Title */}
        {title && (
          <h3 className="font-bold text-base text-foreground mb-2 text-pretty leading-snug">{title}</h3>
        )}

        {/* Star rating */}
        {type === 'testimonial' && rating && (
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-xs" style={{ color: i < rating ? '#f4a295' : '#555' }}>★</span>
            ))}
          </div>
        )}

        {/* Body */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">{body}</p>

        {/* Media */}
        {image && (
          <div className="mb-3 rounded-xl overflow-hidden bg-muted" style={{ aspectRatio: '16/9' }}>
            {image.match(/\.(mp4|webm)$/i) ? (
              <video src={image} controls className="w-full h-full object-cover" onClick={(e) => e.preventDefault()} />
            ) : (
              <img src={image} alt={title || 'Post image'} className="w-full h-full object-cover" />
            )}
          </div>
        )}
        {type === 'testimonial' && clientImage && (
          <div className="mb-3 rounded-xl overflow-hidden bg-muted" style={{ aspectRatio: '16/9' }}>
            <img src={clientImage} alt={author || 'Client'} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Tech tags */}
        {projectTech.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {projectTech.map((tech) => (
              <span key={tech} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">{tech}</span>
            ))}
          </div>
        )}

        {/* Project link */}
        {projectLink && (
          <a
            href={projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium mb-3 transition-colors hover:opacity-80"
            style={{ color: '#f4a295' }}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={11} />
            View project
          </a>
        )}

        {/* Linked portfolio project card */}
        {linkedProjectId && (
          <Link
            href={`/portfolio/${linkedProjectId}`}
            className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl border border-border bg-muted/50 hover:border-[#f4a295]/50 transition-colors group"
            onClick={(e) => e.stopPropagation()}
          >
            <TrendingUp size={13} style={{ color: '#f4a295' }} className="shrink-0" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              View related portfolio project
            </span>
            <span className="ml-auto text-xs font-semibold" style={{ color: '#f4a295' }}>→</span>
          </Link>
        )}

        {/* Action row */}
        <div className="flex items-center gap-6 mt-1">
          <button
            onClick={handleLike}
            className={cn(
              'flex items-center gap-1.5 text-xs transition-colors group',
              liked ? 'text-rose-400' : 'text-muted-foreground hover:text-rose-400'
            )}
            aria-label="Like"
          >
            <Heart size={15} className={cn('transition-transform group-active:scale-125', liked && 'fill-rose-400')} />
            <span>{likes}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageCircle size={15} />
            <span>{replies}</span>
          </div>

          {detailHref && (
            <Link
              href={detailHref}
              className="text-xs font-semibold transition-colors ml-1"
              style={{ color: '#f4a295' }}
              onClick={(e) => e.stopPropagation()}
            >
              Read more →
            </Link>
          )}

          <button
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
            aria-label="Share"
            onClick={handleShare}
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <article className={cn(
      'px-4 py-5 border-b border-border transition-colors',
      detailHref ? 'cursor-pointer hover:bg-muted/30' : ''
    )}>
      {detailHref ? (
        <Link href={detailHref} className="block" tabIndex={-1} aria-label={`Read full post: ${title}`}>
          {inner}
        </Link>
      ) : inner}
    </article>
  )
}
