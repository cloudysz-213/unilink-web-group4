import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Debug logging for production
  console.log('Middleware check:', {
    pathname,
    hasUser: !!user,
    userId: user?.id,
    error: error?.message
  })

  const publicRoutes = ['/', '/login', '/signup', '/auth/callback']

  if (pathname.startsWith('/api')) {
    return supabaseResponse
  }

  if (publicRoutes.includes(pathname)) {
    return supabaseResponse
  }

  if (!user) {
    console.log('No user found, redirecting to login from:', pathname)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('User authenticated, allowing access to:', pathname)
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}