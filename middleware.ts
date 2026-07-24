import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'admin_session'
const PROTECTED = '/data-management'
const LOGIN_PAGE = '/admin/login'

async function sha256(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function makeSessionToken(username: string, password: string): Promise<string> {
  return sha256(`${username}:${password}:${password}:nextzd-session`)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /data-management and its sub-paths
  if (!pathname.startsWith(PROTECTED)) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)

  if (!sessionCookie?.value) {
    const loginUrl = new URL(LOGIN_PAGE, request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const envUsername = process.env.ADMIN_USERNAME ?? ''
  const envPassword = process.env.ADMIN_PASSWORD ?? ''

  if (!envUsername || !envPassword) {
    // Credentials not configured — let through to show an error inside the page
    return NextResponse.next()
  }

  try {
    const expectedToken = await makeSessionToken(envUsername, envPassword)
    if (sessionCookie.value !== expectedToken) {
      const loginUrl = new URL(LOGIN_PAGE, request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  } catch {
    const loginUrl = new URL(LOGIN_PAGE, request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/data-management', '/data-management/:path*'],
}
