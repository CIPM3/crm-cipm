'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from '@/store/useAuthStore'
import AuthProvider from '@/components/providers/AuthProvider'

const ThemeProvider = dynamic(
  () => import('next-themes').then(mod => ({ default: mod.ThemeProvider })),
  { ssr: false }
)

// Performance optimized query client configuration
const createOptimizedQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error)
      },
    },
  },
})

interface OptimizedProvidersProps {
  children: React.ReactNode
}

// Separate auth initialization to reduce bundle size
function AuthInitializer({ children }: { children: React.ReactNode }) {
  // Initialize auth state on client
  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Any auth initialization logic
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
          const authData = JSON.parse(authStorage)
          if (authData?.state?.user) {
            useAuthStore.getState().setUser(authData.state.user)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      }
    }

    initializeAuth()
  }, [])

  return <>{children}</>
}

// Loading fallback for Suspense boundaries
function ProvidersLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}

// Error boundary for providers
class ProvidersErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Providers error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function OptimizedProviders({ children }: OptimizedProvidersProps) {
  // Use singleton pattern for query client
  const [queryClient] = React.useState(createOptimizedQueryClient)

  return (
    <ProvidersErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<ProvidersLoading />}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            forcedTheme="light"
            disableTransitionOnChange
          >
            <AuthProvider>
              <AuthInitializer>
                {children}
              </AuthInitializer>
            </AuthProvider>
            <Toaster 
              richColors 
              closeButton 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                },
              }}
            />
          </ThemeProvider>
        </Suspense>
        {process.env.NODE_ENV === 'development' && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </QueryClientProvider>
    </ProvidersErrorBoundary>
  )
}

// Export performance monitoring hook
export function usePerformanceMonitoring() {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            console.log('Navigation Performance:', {
              loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              firstByte: navEntry.responseStart - navEntry.requestStart,
            })
          }
        }
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      
      return () => observer.disconnect()
    }
  }, [])
}