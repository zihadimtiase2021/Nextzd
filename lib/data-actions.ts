'use server'

import fs from 'fs/promises'
import path from 'path'
import type { FeedItem, Project } from '@/lib/data'

const FEED_FILE = path.join(process.cwd(), 'data', 'feed.json')
const PORTFOLIO_FILE = path.join(process.cwd(), 'data', 'portfolio.json')

// ── Feed ─────────────────────────────────────────────────────────────────────

export async function getFeedData(): Promise<{ items: FeedItem[] }> {
  try {
    const raw = await fs.readFile(FEED_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { items: [] }
  }
}

export async function addFeedItem(
  item: Omit<FeedItem, 'id' | 'date' | 'likes' | 'replies'>,
): Promise<{ success: boolean; item?: FeedItem; error?: string }> {
  try {
    const data = await getFeedData()
    const newItem: FeedItem = {
      ...item,
      id: `feed-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      replies: 0,
    }
    data.items.unshift(newItem)
    await fs.writeFile(FEED_FILE, JSON.stringify(data, null, 2))
    return { success: true, item: newItem }
  } catch {
    return { success: false, error: 'Failed to add feed item' }
  }
}

export async function updateFeedItem(
  itemId: string,
  updates: Partial<FeedItem>,
): Promise<{ success: boolean; item?: FeedItem; error?: string }> {
  try {
    const data = await getFeedData()
    const idx = data.items.findIndex((i) => i.id === itemId)
    if (idx === -1) return { success: false, error: 'Item not found' }
    data.items[idx] = { ...data.items[idx], ...updates }
    await fs.writeFile(FEED_FILE, JSON.stringify(data, null, 2))
    return { success: true, item: data.items[idx] }
  } catch {
    return { success: false, error: 'Failed to update feed item' }
  }
}

export async function deleteFeedItem(
  itemId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await getFeedData()
    data.items = data.items.filter((i) => i.id !== itemId)
    await fs.writeFile(FEED_FILE, JSON.stringify(data, null, 2))
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete feed item' }
  }
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

export async function getPortfolioData(): Promise<{ projects: Project[] }> {
  try {
    const raw = await fs.readFile(PORTFOLIO_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { projects: [] }
  }
}

export async function addPortfolioProject(
  project: Omit<Project, 'id'>,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const data = await getPortfolioData()
    const newProject: Project = { ...project, id: `proj-${Date.now()}` }
    data.projects.unshift(newProject)
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(data, null, 2))
    return { success: true, project: newProject }
  } catch {
    return { success: false, error: 'Failed to add project' }
  }
}

export async function updatePortfolioProject(
  projectId: string,
  updates: Partial<Project>,
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const data = await getPortfolioData()
    const idx = data.projects.findIndex((p) => p.id === projectId)
    if (idx === -1) return { success: false, error: 'Project not found' }
    data.projects[idx] = { ...data.projects[idx], ...updates }
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(data, null, 2))
    return { success: true, project: data.projects[idx] }
  } catch {
    return { success: false, error: 'Failed to update project' }
  }
}

export async function deletePortfolioProject(
  projectId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await getPortfolioData()
    data.projects = data.projects.filter((p) => p.id !== projectId)
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(data, null, 2))
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete project' }
  }
}
