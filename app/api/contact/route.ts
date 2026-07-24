import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contacts.json')

interface ContactSubmission {
  id: string
  name: string
  email: string
  service: string
  budget: string
  message: string
  submittedAt: string
}

async function readContacts(): Promise<{ submissions: ContactSubmission[] }> {
  try {
    const raw = await fs.readFile(CONTACTS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { submissions: [] }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, service, budget, message } = body as {
      name?: string
      email?: string
      service?: string
      budget?: string
      message?: string
    }

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const data = await readContacts()
    const submission: ContactSubmission = {
      id: `contact-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service: service?.trim() ?? '',
      budget: budget?.trim() ?? '',
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    }
    data.submissions.unshift(submission)
    await fs.writeFile(CONTACTS_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[contact POST]', err)
    return NextResponse.json({ error: 'Failed to save submission. Please try again.' }, { status: 500 })
  }
}
