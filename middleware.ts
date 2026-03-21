// Temporary disable middleware for testing
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Empty config to avoid conflicts
export const config = {
  matcher: [],
}