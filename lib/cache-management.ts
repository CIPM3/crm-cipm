// === INTELLIGENT CACHE MANAGEMENT SYSTEM ===
// Provides smart cache invalidation, preloading, and mobile optimizations

import { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'

interface CacheConfig {
  maxSize: number
  maxAge: number
  compressionEnabled: boolean
  mobileOptimized: boolean
}

interface CacheEntry {
  data: any
  timestamp: number
  accessCount: number
  lastAccessed: number
  size: number
}

class IntelligentCacheManager {
  private cache: Map<string, CacheEntry> = new Map()
  private config: CacheConfig
  private queryClient: QueryClient | null = null
  
  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: config.maxSize || (this.isMobile() ? 50 : 100), // MB
      maxAge: config.maxAge || (this.isMobile() ? 5 * 60 * 1000 : 15 * 60 * 1000),
      compressionEnabled: config.compressionEnabled ?? true,
      mobileOptimized: config.mobileOptimized ?? this.isMobile()
    }
    
    // Cleanup interval
    setInterval(() => this.cleanup(), 2 * 60 * 1000) // Every 2 minutes
  }
  
  setQueryClient(client: QueryClient) {
    this.queryClient = client
  }
  
  private isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
  
  private getDataSize(data: any): number {
    return JSON.stringify(data).length / 1024 // KB
  }
  
  private shouldCompress(data: any): boolean {
    return this.config.compressionEnabled && this.getDataSize(data) > 10 // > 10KB
  }
  
  // === CORE CACHE OPERATIONS ===
  
  /**
   * Set cache entry with intelligent expiration
   */
  set(key: string, data: any, customTTL?: number): void {
    const size = this.getDataSize(data)
    const ttl = customTTL || this.config.maxAge
    
    // Skip caching if data is too large on mobile
    if (this.config.mobileOptimized && size > 100) { // 100KB limit on mobile
      console.warn(`Skipping cache for ${key} - too large for mobile (${size}KB)`)
      return
    }
    
    const entry: CacheEntry = {
      data: this.shouldCompress(data) ? this.compress(data) : data,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
      size
    }
    
    this.cache.set(key, entry)
    this.enforceSize()
  }
  
  /**
   * Get cache entry with access tracking
   */
  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    // Check expiration
    if (Date.now() - entry.timestamp > this.config.maxAge) {
      this.cache.delete(key)
      return null
    }
    
    // Update access stats
    entry.accessCount++
    entry.lastAccessed = Date.now()
    
    return this.isCompressed(entry.data) ? this.decompress(entry.data) : entry.data
  }
  
  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    if (Date.now() - entry.timestamp > this.config.maxAge) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }
  
  /**
   * Remove specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }
  
  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }
  
  // === INTELLIGENT INVALIDATION ===
  
  /**
   * Smart invalidation based on data relationships
   */
  invalidateRelated(pattern: string): void {
    const keys = Array.from(this.cache.keys())
    const keysToDelete = keys.filter(key => key.includes(pattern))
    
    keysToDelete.forEach(key => this.cache.delete(key))
    
    // Also invalidate query client cache
    if (this.queryClient) {
      this.queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.some(key => 
            typeof key === 'string' && key.includes(pattern)
          )
        }
      })
    }
  }
  
  /**
   * Invalidate comments cache when course data changes
   */
  invalidateCommentsOnCourseChange(courseId: string): void {
    const patterns = [
      `comments-${courseId}`,
      `comment-stats-${courseId}`,
      `course-${courseId}`,
      'recent-comments'
    ]
    
    patterns.forEach(pattern => this.invalidateRelated(pattern))
  }
  
  /**
   * Invalidate user-related caches on profile changes
   */
  invalidateUserRelated(userId: string): void {
    const patterns = [
      `user-${userId}`,
      `user-comments-${userId}`,
      'user-list'
    ]
    
    patterns.forEach(pattern => this.invalidateRelated(pattern))
  }
  
  // === PRELOADING & PREFETCHING ===
  
  /**
   * Preload critical data for instant access
   */
  async preloadCriticalData(courseId: string): Promise<void> {
    if (!this.queryClient) return
    
    // Preload in priority order
    const preloadTasks = [
      // High priority: Course details
      this.queryClient.prefetchQuery({
        queryKey: queryKeys.curso(courseId),
        staleTime: 10 * 60 * 1000 // 10 minutes
      }),
      
      // Medium priority: Recent comments
      this.queryClient.prefetchQuery({
        queryKey: queryKeys.optimizedCommentsByCurso(courseId),
        staleTime: 5 * 60 * 1000 // 5 minutes
      }),
      
      // Low priority on mobile: Comment stats
      ...(this.config.mobileOptimized ? [] : [
        this.queryClient.prefetchQuery({
          queryKey: queryKeys.commentStats(courseId),
          staleTime: 10 * 60 * 1000
        })
      ])
    ]
    
    try {
      await Promise.allSettled(preloadTasks)
    } catch (error) {
      console.warn('Failed to preload some data:', error)
    }
  }
  
  /**
   * Background preloading based on user behavior
   */
  schedulePreload(courseIds: string[], delay = 2000): void {
    if (this.config.mobileOptimized && courseIds.length > 3) {
      courseIds = courseIds.slice(0, 3) // Limit preloading on mobile
    }
    
    setTimeout(() => {
      courseIds.forEach(courseId => {
        this.preloadCriticalData(courseId).catch(console.warn)
      })
    }, delay)
  }
  
  // === MEMORY MANAGEMENT ===
  
  /**
   * Enforce cache size limits
   */
  private enforceSize(): void {
    const totalSize = Array.from(this.cache.values())
      .reduce((total, entry) => total + entry.size, 0)
    
    if (totalSize > this.config.maxSize * 1024) { // Convert MB to KB
      this.evictLeastUsed()
    }
  }
  
  /**
   * Evict least recently used entries
   */
  private evictLeastUsed(): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => {
        // Sort by access count (ascending) then by last accessed (ascending)
        if (a.accessCount !== b.accessCount) {
          return a.accessCount - b.accessCount
        }
        return a.lastAccessed - b.lastAccessed
      })
    
    // Remove bottom 25% of entries
    const toRemove = Math.ceil(entries.length * 0.25)
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0])
    }
  }
  
  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > this.config.maxAge) {
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => this.cache.delete(key))
    
    // Also cleanup query client cache more aggressively on mobile
    if (this.config.mobileOptimized && this.queryClient) {
      this.queryClient.getQueryCache().getAll().forEach(query => {
        const age = now - query.state.dataUpdatedAt
        if (age > this.config.maxAge && query.getObserversCount() === 0) {
          this.queryClient!.getQueryCache().remove(query)
        }
      })
    }
  }
  
  // === COMPRESSION (Simplified) ===
  
  private compress(data: any): { compressed: true; data: string } {
    // Simple compression - in real app, use proper compression library
    return {
      compressed: true,
      data: JSON.stringify(data)
    }
  }
  
  private decompress(compressedData: any): any {
    if (this.isCompressed(compressedData)) {
      return JSON.parse(compressedData.data)
    }
    return compressedData
  }
  
  private isCompressed(data: any): boolean {
    return data && typeof data === 'object' && data.compressed === true
  }
  
  // === ANALYTICS ===
  
  /**
   * Get cache performance metrics
   */
  getMetrics(): {
    totalEntries: number
    totalSize: number
    hitRate: number
    avgAccessCount: number
    expiredEntries: number
  } {
    const entries = Array.from(this.cache.values())
    const now = Date.now()
    
    return {
      totalEntries: entries.length,
      totalSize: entries.reduce((total, entry) => total + entry.size, 0),
      hitRate: entries.length > 0 
        ? entries.reduce((total, entry) => total + entry.accessCount, 0) / entries.length 
        : 0,
      avgAccessCount: entries.length > 0
        ? entries.reduce((total, entry) => total + entry.accessCount, 0) / entries.length
        : 0,
      expiredEntries: entries.filter(entry => 
        now - entry.timestamp > this.config.maxAge
      ).length
    }
  }
}

// === SINGLETON INSTANCE ===
export const cacheManager = new IntelligentCacheManager()

// === REACT HOOKS FOR CACHE MANAGEMENT ===

import { useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Hook to initialize cache management
 */
export const useCacheManager = (config?: Partial<CacheConfig>) => {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    cacheManager.setQueryClient(queryClient)
    
    // Update config if provided
    if (config) {
      Object.assign((cacheManager as any).config, config)
    }
  }, [queryClient, config])
  
  return cacheManager
}

/**
 * Hook for smart cache invalidation
 */
export const useSmartInvalidation = () => {
  const queryClient = useQueryClient()
  
  return useCallback((patterns: string[]) => {
    patterns.forEach(pattern => {
      cacheManager.invalidateRelated(pattern)
    })
  }, [])
}

/**
 * Hook for preloading data
 */
export const usePreloader = () => {
  return useCallback((courseIds: string[], immediate = false) => {
    if (immediate) {
      courseIds.forEach(courseId => {
        cacheManager.preloadCriticalData(courseId)
      })
    } else {
      cacheManager.schedulePreload(courseIds)
    }
  }, [])
}

export default cacheManager