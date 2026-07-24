'use server'

import fs from 'fs/promises'
import path from 'path'

const FEED_FILE = path.join(process.cwd(), 'data', 'feed.json')
const PORTFOLIO_FILE = path.join(process.cwd(), 'data', 'portfolio.json')

// Feed Actions
export async function getFeedData() {
  try {
    const data = await fs.readFile(FEED_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading feed data:', error)
    return { items: [] }
  }
}

export async function addFeedItem(item: any) {
  try {
    const data = await getFeedData()
    const newItem = {
      ...item,
      id: `feed-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      replies: 0,
    }
    data.items.unshift(newItem)
    await fs.writeFile(FEED_FILE, JSON.stringify(data, null, 2))
    return { success: true, item: newItem }
  } catch (error) {
    console.error('Error adding feed item:', error)
    return { success: false, error: 'Failed to add feed item' }
  }
}

export async function updateFeedItem(itemId: string, updates: any) {
  try {
    const data = await getFeedData()
    const itemIndex = data.items.findIndex((item: any) => item.id === itemId)
    if (itemIndex === -1) {
      return { success: false, error: 'Item not found' }
    }
    data.items[itemIndex] = { ...data.items[itemIndex], ...updates }
    await fs.writeFile(FEED_FILE, JSON.stringify(data, null, 2))
    return { success: true, item: data.items[itemIndex] }
  } catch (error) {
    console.error('Error updating feed item:', error)
    return { success: false, error: 'Failed to update feed item' }
  }
}

export async function deleteFeedItem(itemId: string) {
  try {
    const data = await getFeedData()
    data.items = data.items.filter((item: any) => item.id !== itemId)
    await fs.writeFile(FEED_FILE, JSON.stringify(data, null, 2))
    return { success: true }
  } catch (error) {
    console.error('Error deleting feed item:', error)
    return { success: false, error: 'Failed to delete feed item' }
  }
}

// Portfolio Actions
export async function getPortfolioData() {
  try {
    const data = await fs.readFile(PORTFOLIO_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading portfolio data:', error)
    return { projects: [] }
  }
}

export async function addPortfolioProject(project: any) {
  try {
    const data = await getPortfolioData()
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
    }
    data.projects.unshift(newProject)
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(data, null, 2))
    return { success: true, project: newProject }
  } catch (error) {
    console.error('Error adding portfolio project:', error)
    return { success: false, error: 'Failed to add project' }
  }
}

export async function updatePortfolioProject(projectId: string, updates: any) {
  try {
    const data = await getPortfolioData()
    const projectIndex = data.projects.findIndex((p: any) => p.id === projectId)
    if (projectIndex === -1) {
      return { success: false, error: 'Project not found' }
    }
    data.projects[projectIndex] = { ...data.projects[projectIndex], ...updates }
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(data, null, 2))
    return { success: true, project: data.projects[projectIndex] }
  } catch (error) {
    console.error('Error updating portfolio project:', error)
    return { success: false, error: 'Failed to update project' }
  }
}

export async function deletePortfolioProject(projectId: string) {
  try {
    const data = await getPortfolioData()
    data.projects = data.projects.filter((p: any) => p.id !== projectId)
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(data, null, 2))
    return { success: true }
  } catch (error) {
    console.error('Error deleting portfolio project:', error)
    return { success: false, error: 'Failed to delete project' }
  }
}
