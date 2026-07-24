import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: images (JPG, PNG, GIF, WebP) and videos (MP4, WebM)' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 })
    }

    // Create unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const filename = `${timestamp}-${random}-${file.name.replace(/\s+/g, '-')}`

    // Save file to public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Ensure directory exists
    try {
      await fs.mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.error('Error creating uploads directory:', error)
    }

    const filePath = path.join(uploadsDir, filename)
    const buffer = await file.arrayBuffer()
    await fs.writeFile(filePath, Buffer.from(buffer))

    // Return public URL
    const publicUrl = `/uploads/${filename}`
    return NextResponse.json({ success: true, url: publicUrl }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 })
  }
}
