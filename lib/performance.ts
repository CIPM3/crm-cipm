// lib/performance.ts
import { unstable_cache as cache } from 'next/cache'

// Performance monitoring and optimization utilities
export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  memoryUsage?: number
}

// Cache configuration for different data types
export const CACHE_CONFIG = {
  // Short cache for frequently changing data
  dynamic: {
    revalidate: 60, // 1 minute
    tags: ['dynamic']
  },
  
  // Medium cache for moderately changing data
  semi_static: {
    revalidate: 300, // 5 minutes
    tags: ['semi-static']
  },
  
  // Long cache for rarely changing data
  static: {
    revalidate: 3600, // 1 hour
    tags: ['static']
  },
  
  // Very long cache for configuration data
  config: {
    revalidate: 86400, // 24 hours
    tags: ['config']
  }
} as const

// Cached Firebase operations
export const createCachedFirebaseQuery = <T>(
  queryFn: () => Promise<T>,
  cacheKey: string[],
  config: typeof CACHE_CONFIG[keyof typeof CACHE_CONFIG] = CACHE_CONFIG.semi_static
) => {
  return cache(
    queryFn,
    cacheKey,
    {
      revalidate: config.revalidate,
      tags: config.tags
    }
  )
}

// Performance observer for Core Web Vitals
export function initializePerformanceObserver() {
  if (typeof window === 'undefined') return

  // Observer for navigation timing
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log performance metrics
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          const metrics: PerformanceMetrics = {
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            renderTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            interactionTime: navEntry.responseStart - navEntry.requestStart
          }
          
          console.log('Navigation Performance:', metrics)
          
          // Send to analytics if available
          if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_performance', {
              custom_parameter_1: metrics.loadTime,
              custom_parameter_2: metrics.renderTime
            })
          }
        }
        
        // Core Web Vitals
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime)
        }
        
        if (entry.entryType === 'first-input') {
          console.log('FID:', (entry as any).processingStart - entry.startTime)
        }
        
        if (entry.entryType === 'layout-shift') {
          if (!(entry as any).hadRecentInput) {
            console.log('CLS:', (entry as any).value)
          }
        }
      }
    })

    // Observe different performance metrics
    try {
      observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (error) {
      console.warn('Performance Observer not fully supported:', error)
    }
  }
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// Throttle function for scroll events and similar
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return null
  
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    })
  }
  
  return null
}

// Image lazy loading utility
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  placeholder?: string
) {
  if (!img) return
  
  const observer = createIntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement
        image.src = src
        image.onload = () => {
          image.style.filter = 'none'
          image.style.transition = 'filter 0.3s'
        }
        observer?.unobserve(image)
      }
    })
  })
  
  if (observer) {
    if (placeholder) {
      img.src = placeholder
      img.style.filter = 'blur(5px)'
    }
    observer.observe(img)
  } else {
    // Fallback for unsupported browsers
    img.src = src
  }
}

// Preload critical resources
export function preloadResource(href: string, as: string) {
  if (typeof document === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous'
  }
  
  document.head.appendChild(link)
}

// Bundle analyzer helper
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'production') {
    import('@next/bundle-analyzer')
      .then(({ default: withBundleAnalyzer }) => {
        console.log('Bundle analyzer available. Run with ANALYZE=true')
      })
      .catch(() => {
        console.log('Bundle analyzer not available')
      })
  }
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in performance)) return
  
  const memory = (performance as any).memory
  
  return {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit
  }
}

// Component performance wrapper
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function WrappedComponent(props: P) {
    React.useEffect(() => {
      const startTime = performance.now()
      
      return () => {
        const endTime = performance.now()
        console.log(`${componentName} render time:`, endTime - startTime, 'ms')
      }
    })
    
    return React.createElement(Component, props)
  }
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
  
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}