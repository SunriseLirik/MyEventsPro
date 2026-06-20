import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PROTECTED_PATHS = ['/profile', '/create-event', '/admin']
const ORGANIZER_PATHS = ['/create-event', '/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isOrganizerPath = ORGANIZER_PATHS.some((p) => pathname.startsWith(p))

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      if (isOrganizerPath && payload.role !== 'ORGANIZER' && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/create-event/:path*', '/admin/:path*'],
}
