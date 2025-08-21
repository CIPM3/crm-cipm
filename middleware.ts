import { NextRequest, NextResponse } from 'next/server'

// Define protected routes and their required roles
const ROUTE_CONFIG = {
  // Admin routes - require admin role
  admin: {
    paths: ['/admin'],
    requiredRoles: ['admin', 'develop'],
    redirectTo: '/login'
  },
  // Public routes - no authentication required
  public: {
    paths: ['/', '/login', '/register', '/cursos', '/videos'],
    requiredRoles: [],
    redirectTo: null
  },
  // API routes protection
  api: {
    paths: ['/api'],
    requiredRoles: [],
    redirectTo: null
  }
} as const

type UserRole = 'admin' | 'instructor' | 'formacion de grupo' | 'agendador' | 'base' | 'cliente' | 'develop'

interface AuthUser {
  uid: string
  email: string
  role: UserRole
  displayName?: string
}

// Helper function to get user from cookie/session
async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authCookie = request.cookies.get('auth-storage')?.value
    
    if (!authCookie) {
      return null
    }

    // Parse the auth storage cookie (Zustand persist format)
    let authData: any
    try {
      authData = JSON.parse(authCookie)
    } catch {
      authData = JSON.parse(decodeURIComponent(authCookie))
    }
    const user = authData?.state?.user

    if (!user || !(user.uid || user.id) || !user.email) {
      return null
    }

    const extractedRole = user.role || user.rol || 'cliente'

    return {
      uid: user.uid || user.id,
      email: user.email,
      role: extractedRole,
      displayName: user.displayName || user.name
    }
  } catch (error) {
    console.error('Error parsing auth user:', error)
    return null
  }
}

// Helper function to check if route matches pattern
function matchesPath(pathname: string, patterns: readonly string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('*')) {
      return pathname.startsWith(pattern.slice(0, -1))
    }
    return pathname === pattern || pathname.startsWith(pattern + '/')
  })
}

// Helper function to check if user has required role
function hasRequiredRole(userRole: UserRole, requiredRoles: readonly string[]): boolean {
  if (requiredRoles.length === 0) return true
  return requiredRoles.includes(userRole)
}

// Rate limiting helper (simple in-memory store)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count++
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
    if (isRateLimited(ip, 100, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
  }

  // Handle auth routes - redirect authenticated users away from login/register
  if (pathname === '/login' || pathname === '/register') {
    const user = await getAuthUser(request)
    if (user) {
      // Check if there's a redirect parameter - if so, don't redirect here
      // Let the client handle the redirect to avoid loops
      const hasRedirectParam = request.nextUrl.searchParams.has('redirect')
      if (!hasRedirectParam) {
        const redirectUrl = new URL('/admin/dashboard', request.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
    return NextResponse.next()
  }

  // Handle admin routes protection
  if (matchesPath(pathname, ROUTE_CONFIG.admin.paths)) {
    const user = await getAuthUser(request)
    
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (!hasRequiredRole(user.role, [...ROUTE_CONFIG.admin.requiredRoles, 'develop'])) {
      // Redirect based on user role
      const dashboardUrl = new URL(getDashboardForRole(user.role), request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // Handle API routes authentication
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    const user = await getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Add user info to headers for API routes to access
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', user.uid)
    requestHeaders.set('x-user-email', user.email)
    requestHeaders.set('x-user-role', user.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Security headers for all routes
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // HSTS for HTTPS
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  return response
}

// Helper function to get dashboard URL based on user role
function getDashboardForRole(role: UserRole): string {
  switch (role) {
    case 'develop':
      return '/admin/dashboard'
    case 'admin':
      return '/admin/dashboard'
    case 'instructor':
      return '/instructor/dashboard'
    case 'formacion de grupo':
      return '/formacion/dashboard'
    case 'agendador':
      return '/agendador/dashboard'
    default:
      return '/cursos' // Default for clients
  }
}

// Configure which paths should be processed by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}