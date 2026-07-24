import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json')

const DEFAULT_SETTINGS = {
  hero: { coverMedia: '', profileMedia: '' },
  about: { media: [] as string[] },
}

async function readSettings() {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8')
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export async function GET() {
  try {
    const settings = await readSettings()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function PUT(req: Request) {
  try {
    const updates = await req.json()
    const current = await readSettings()
    const next = {
      hero: { ...current.hero, ...(updates.hero ?? {}) },
      about: { ...current.about, ...(updates.about ?? {}) },
    }
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(next, null, 2))
    return NextResponse.json({ success: true, settings: next })
  } catch (err) {
    console.error('[settings PUT]', err)
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 })
  }
}
