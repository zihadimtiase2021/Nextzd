/**
 * Plain data-read helpers — no 'use server' directive.
 * Safe to import in API route handlers and Server Components.
 */
import fs from 'fs/promises'
import path from 'path'

const FEED_FILE = path.join(process.cwd(), 'data', 'feed.json')
const PORTFOLIO_FILE = path.join(process.cwd(), 'data', 'portfolio.json')
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json')

export interface FeedItem {
  id: string
  type: string
  title: string
  excerpt: string
  content: string
  category: string
  image?: string
  media?: string[]
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

export interface Project {
  id: string
  title: string
  category: string
  description: string
  tech: string[]
  results: Record<string, string>
  link?: string
  github?: string
  image?: string
  images?: string[]
  content?: Array<{
    id: string
    type: 'paragraph' | 'heading' | 'image' | 'divider'
    text?: string
    url?: string
    caption?: string
  }>
  featured: boolean
}

export interface SiteSettings {
  hero: { coverMedia: string; profileMedia: string }
  about: { media: string[] }
}

export async function readFeedData(): Promise<{ items: FeedItem[] }> {
  try {
    const raw = await fs.readFile(FEED_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { items: [] }
  }
}

export async function readPortfolioData(): Promise<{ projects: Project[] }> {
  try {
    const raw = await fs.readFile(PORTFOLIO_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { projects: [] }
  }
}

export async function readSettingsData(): Promise<SiteSettings> {
  const DEFAULT: SiteSettings = { hero: { coverMedia: '', profileMedia: '' }, about: { media: [] } }
  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8')
    return { ...DEFAULT, ...JSON.parse(raw) }
  } catch {
    return DEFAULT
  }
}
