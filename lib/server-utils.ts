// lib/server-utils.ts
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { Metadata } from 'next'
import type { User } from 'firebase/auth'

// Server-side user type
export interface ServerUser {
  uid: string
  email: string
  role: string
  displayName?: string
}

// Cache the auth check to avoid multiple calls per request
export const getServerUser = cache(async (): Promise<ServerUser | null> => {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get('auth-storage')?.value
    
    if (!authCookie) {
      return null
    }

    let authData: any
    try {
      authData = JSON.parse(authCookie)
    } catch {
      authData = JSON.parse(decodeURIComponent(authCookie))
    }
    const user = authData?.state?.user

    if (!(user?.uid || user?.id) || !user?.email) {
      return null
    }

    return {
      uid: user.uid || user.id,
      email: user.email,
      role: user.role || user.rol || 'cliente',
      displayName: user.displayName || user.name
    }
  } catch (error) {
    console.error('Error getting server user:', error)
    return null
  }
})

// Server-side authentication check with redirect
export async function requireAuth(redirectTo: string = '/login'): Promise<ServerUser> {
  const user = await getServerUser()
  
  if (!user) {
    redirect(redirectTo)
  }
  
  return user
}

// Server-side role check with redirect
export async function requireRole(
  requiredRoles: string[], 
  redirectTo: string = '/login'
): Promise<ServerUser> {
  const user = await requireAuth(redirectTo)
  
  if (!requiredRoles.includes(user.role)) {
    redirect(getDashboardForRole(user.role))
  }
  
  return user
}

// Server-side admin check
export async function requireAdmin(): Promise<ServerUser> {
  return requireRole(['admin', 'develop'], '/login')
}

// Get dashboard URL for role
export function getDashboardForRole(role: string): string {
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
      return '/cursos'
  }
}

// Server-side Firebase service access with user context
export interface ServerContext {
  user: ServerUser
  headers: Headers
}

export async function getServerContext(): Promise<ServerContext> {
  const user = await requireAuth()
  const headersList = headers()
  
  return {
    user,
    headers: headersList
  }
}

// Metadata helpers for dynamic pages
export function generatePageMetadata({
  title,
  description,
  keywords,
  image,
}: {
  title: string
  description: string
  keywords?: string[]
  image?: string
}): Metadata {
  return {
    title: `${title} | CIPM - Sistema CRM`,
    description,
    keywords: keywords?.join(', '),
    openGraph: {
      title: `${title} | CIPM`,
      description,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | CIPM`,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: false, // CRM should not be indexed
      follow: false,
    },
  }
}

// Server-side data fetching with error handling
export async function serverFetch<T>(
  fetchFn: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    return await fetchFn()
  } catch (error) {
    console.error('Server fetch error:', error)
    if (fallback !== undefined) {
      return fallback
    }
    throw error
  }
}

// Preload function for critical data
export function preloadCriticalData<T>(
  key: string,
  fetchFn: () => Promise<T>
): () => Promise<T> {
  let promise: Promise<T> | null = null
  
  return () => {
    if (!promise) {
      promise = fetchFn()
    }
    return promise
  }
}

// Server action helpers
export interface ServerActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
  validationErrors?: Record<string, string[]>
}

export function createServerActionResult<T>(
  data?: T,
  error?: string,
  validationErrors?: Record<string, string[]>
): ServerActionResult<T> {
  return {
    success: !error && !validationErrors,
    data,
    error,
    validationErrors
  }
}

// Rate limiting for server actions
const actionLimiter = new Map<string, { count: number; resetTime: number }>()

export function checkActionRateLimit(
  userId: string,
  action: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const key = `${userId}:${action}`
  const now = Date.now()
  const record = actionLimiter.get(key)

  if (!record || now > record.resetTime) {
    actionLimiter.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count++
  return false
}