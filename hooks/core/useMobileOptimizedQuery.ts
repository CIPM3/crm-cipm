// === MOBILE-OPTIMIZED QUERY HOOK ===
// Provides intelligent mobile performance optimization with adaptive caching

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

// Mobile detection hook
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || 
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

// Network detection hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<'slow' | 'fast' | 'unknown'>('unknown')
  
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    
    const updateConnection = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      
      if (connection) {
        const effectiveType = connection.effectiveType
        setConnectionType(
          effectiveType === '2g' || effectiveType === 'slow-2g' ? 'slow' : 'fast'
        )
      }
    }
    
    updateOnlineStatus()
    updateConnection()
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateConnection)
    }
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      if (connection) {
        connection.removeEventListener('change', updateConnection)
      }
    }
  }, [])
  
  return { isOnline, connectionType }
}

interface MobileOptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: any[]
  queryFn: () => Promise<T>
  mobileConfig?: {
    reducedStaleTime?: number
    reducedGcTime?: number
    limitDataSize?: boolean
    backgroundSync?: boolean
    preloadOnIdle?: boolean
  }
}

export const useMobileOptimizedQuery = <T>(options: MobileOptimizedQueryOptions<T>) => {
  const mobile = useMobile()
  const { isOnline, connectionType } = useNetworkStatus()
  const queryClient = useQueryClient()
  const lastFetchTime = useRef<number>(0)
  
  // Mobile-optimized configuration
  const mobileConfig = options.mobileConfig || {}
  const {
    reducedStaleTime = 30 * 1000,      // 30 seconds for mobile
    reducedGcTime = 2 * 60 * 1000,     // 2 minutes for mobile
    limitDataSize = true,
    backgroundSync = true,
    preloadOnIdle = false
  } = mobileConfig
  
  // Adaptive configuration based on device and network
  const adaptiveConfig: Partial<UseQueryOptions<T>> = {
    staleTime: mobile ? reducedStaleTime : (options.staleTime || 5 * 60 * 1000),
    gcTime: mobile ? reducedGcTime : (options.gcTime || 10 * 60 * 1000),
    
    // Reduce refetch frequency on mobile or slow connections
    refetchOnWindowFocus: mobile && connectionType === 'slow' ? false : (options.refetchOnWindowFocus ?? true),
    refetchOnReconnect: mobile ? false : (options.refetchOnReconnect ?? true),
    
    // Adjust retry behavior for mobile
    retry: mobile 
      ? (failureCount, error: any) => {
          if (!isOnline) return false // Don't retry when offline
          if (connectionType === 'slow' && failureCount >= 1) return false
          return failureCount < 2
        }
      : options.retry,
    
    // Network-aware retry delay
    retryDelay: attemptIndex => {
      const baseDelay = Math.min(1000 * 2 ** attemptIndex, 30000)
      return connectionType === 'slow' ? baseDelay * 2 : baseDelay
    }
  }
  
  // Smart data transformation for mobile
  const optimizedSelect = options.select || ((data: T) => {
    if (!mobile || !limitDataSize) return data
    
    // If data is an array, limit size for mobile
    if (Array.isArray(data)) {
      return data.slice(0, 20) as T // Limit to 20 items on mobile
    }
    
    return data
  })
  
  const query = useQuery({
    ...options,
    ...adaptiveConfig,
    select: optimizedSelect,
    
    // Enhanced error handling for mobile
    onError: (error: any) => {
      console.error('Mobile query error:', error)
      options.onError?.(error)
      
      // Store failed query for retry when connection improves
      if (!isOnline && backgroundSync) {
        const failedQuery = {
          queryKey: options.queryKey,
          timestamp: Date.now()
        }
        
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('failedQueries')
          const failures = stored ? JSON.parse(stored) : []
          failures.push(failedQuery)
          localStorage.setItem('failedQueries', JSON.stringify(failures.slice(-10))) // Keep last 10
        }
      }
    },
    
    // Success callback with caching optimization
    onSuccess: (data: T) => {
      lastFetchTime.current = Date.now()
      options.onSuccess?.(data)
      
      // Prefetch related data on idle for mobile
      if (mobile && preloadOnIdle && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Implement prefetch logic based on your needs
          console.log('Prefetching related data on idle...')
        })
      }
    }
  })
  
  // Background sync for mobile when coming back online
  useEffect(() => {
    if (isOnline && mobile && backgroundSync && typeof window !== 'undefined') {
      const stored = localStorage.getItem('failedQueries')
      if (stored) {
        const failures = JSON.parse(stored)
        failures.forEach((failure: any) => {
          if (Date.now() - failure.timestamp < 30 * 60 * 1000) { // Within 30 minutes
            queryClient.invalidateQueries({ queryKey: failure.queryKey })
          }
        })
        localStorage.removeItem('failedQueries')
      }
    }
  }, [isOnline, mobile, backgroundSync, queryClient])
  
  // Memory optimization for mobile
  useEffect(() => {
    if (mobile) {
      // Clear unused query cache more aggressively on mobile
      const interval = setInterval(() => {
        queryClient.getQueryCache().getAll().forEach(query => {
          const lastFetch = query.state.dataUpdatedAt
          const age = Date.now() - lastFetch
          
          // Remove queries older than 5 minutes on mobile
          if (age > 5 * 60 * 1000 && query.getObserversCount() === 0) {
            queryClient.getQueryCache().remove(query)
          }
        })
      }, 2 * 60 * 1000) // Every 2 minutes
      
      return () => clearInterval(interval)
    }
  }, [mobile, queryClient])
  
  // Return enhanced query object with mobile-specific utilities
  return {
    ...query,
    
    // Mobile-specific utilities
    isMobile: mobile,
    isOnline,
    connectionType,
    
    // Performance metrics
    lastFetchTime: lastFetchTime.current,
    shouldReduceData: mobile && connectionType === 'slow',
    
    // Mobile actions
    refetchWhenOnline: () => {
      if (isOnline) {
        query.refetch()
      }
    },
    
    clearMobileCache: () => {
      queryClient.removeQueries({ queryKey: options.queryKey })
    }
  }
}

// Specialized hook for paginated queries on mobile
export const useMobileOptimizedInfiniteQuery = <T>(options: any) => {
  const mobile = useMobile()
  const { connectionType } = useNetworkStatus()
  
  return {
    // Return optimized infinite query configuration
    getNextPageParam: mobile 
      ? (lastPage: any, allPages: any[]) => {
          // Limit pages on mobile to prevent memory issues
          if (allPages.length >= 3) return undefined
          return options.getNextPageParam(lastPage, allPages)
        }
      : options.getNextPageParam,
    
    // Reduce initial page size on mobile
    initialPageParam: options.initialPageParam,
    
    // Mobile-specific page size
    pageSize: mobile ? 10 : 20
  }
}

export default useMobileOptimizedQuery