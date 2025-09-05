// === REAL-TIME OPTIMIZATIONS FOR FIREBASE ===
// Provides intelligent real-time updates with mobile performance optimization

import { 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  Unsubscribe,
  QuerySnapshot,
  DocumentChange
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { COLLECTIONS } from '@/lib/constants'
import { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'

interface RealtimeConfig {
  throttleMs: number
  batchUpdates: boolean
  mobileOptimized: boolean
  maxListeners: number
  enableCompression: boolean
}

interface ListenerInfo {
  id: string
  courseId?: string
  unsubscribe: Unsubscribe
  lastUpdate: number
  updateCount: number
  isActive: boolean
}

class RealtimeOptimizationManager {
  private config: RealtimeConfig
  private listeners: Map<string, ListenerInfo> = new Map()
  private updateQueue: Map<string, any[]> = new Map()
  private queryClient: QueryClient | null = null
  private throttleTimers: Map<string, NodeJS.Timeout> = new Map()
  
  constructor(config: Partial<RealtimeConfig> = {}) {
    this.config = {
      throttleMs: config.throttleMs || (this.isMobile() ? 2000 : 500),
      batchUpdates: config.batchUpdates ?? true,
      mobileOptimized: config.mobileOptimized ?? this.isMobile(),
      maxListeners: config.maxListeners || (this.isMobile() ? 3 : 10),
      enableCompression: config.enableCompression ?? true
    }
    
    // Cleanup inactive listeners periodically
    setInterval(() => this.cleanupInactiveListeners(), 5 * 60 * 1000) // Every 5 minutes
  }
  
  setQueryClient(client: QueryClient): void {
    this.queryClient = client
  }
  
  private isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
  
  private generateListenerId(type: string, courseId?: string): string {
    return `${type}-${courseId || 'global'}-${Date.now()}`
  }
  
  // === OPTIMIZED COMMENT LISTENERS ===
  
  /**
   * Smart comment listener with throttling and batching
   */
  subscribeToComments(
    courseId: string, 
    options: {
      onUpdate?: (comments: any[]) => void
      onError?: (error: Error) => void
      throttle?: boolean
    } = {}
  ): string {
    
    // Check listener limit
    if (this.listeners.size >= this.config.maxListeners) {
      console.warn('Max listeners reached, cleaning up oldest...')
      this.cleanupOldestListener()
    }
    
    const listenerId = this.generateListenerId('comments', courseId)
    
    // Create optimized query
    let q = query(
      collection(db, COLLECTIONS.COURSE_COMMENTS),
      where('courseId', '==', courseId),
      orderBy('isPinned', 'desc'),
      orderBy('createdAt', 'desc')
    )
    
    // Limit results on mobile
    if (this.config.mobileOptimized) {
      q = query(q, limit(20))
    }
    
    // Set up throttled update handler
    const handleUpdate = (snapshot: QuerySnapshot) => {
      const listenerId = this.getListenerIdForCourse(courseId)
      if (!listenerId) return
      
      const changes = snapshot.docChanges()
      this.processDocumentChanges(courseId, changes)
      
      // Update listener stats
      const listener = this.listeners.get(listenerId)
      if (listener) {
        listener.lastUpdate = Date.now()
        listener.updateCount++
      }
      
      // Custom callback
      if (options.onUpdate) {
        const comments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        options.onUpdate(comments)
      }
    }
    
    // Create throttled handler
    const throttledHandler = options.throttle !== false 
      ? this.createThrottledHandler(listenerId, handleUpdate)
      : handleUpdate
    
    // Set up listener
    const unsubscribe = onSnapshot(
      q,
      throttledHandler,
      (error) => {
        console.error(`Real-time comments error for course ${courseId}:`, error)
        options.onError?.(error)
        
        // Auto-retry with exponential backoff
        this.scheduleRetry(listenerId, () => {
          this.subscribeToComments(courseId, options)
        })
      }
    )
    
    // Store listener info
    const listenerInfo: ListenerInfo = {
      id: listenerId,
      courseId,
      unsubscribe,
      lastUpdate: Date.now(),
      updateCount: 0,
      isActive: true
    }
    
    this.listeners.set(listenerId, listenerInfo)
    
    return listenerId
  }
  
  /**
   * Subscribe to user-specific comment updates
   */
  subscribeToUserComments(
    userId: string,
    options: {
      onUpdate?: (comments: any[]) => void
      onError?: (error: Error) => void
    } = {}
  ): string {
    
    const listenerId = this.generateListenerId('user-comments', userId)
    
    const q = query(
      collection(db, COLLECTIONS.COURSE_COMMENTS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      ...(this.config.mobileOptimized ? [limit(10)] : [])
    )
    
    const unsubscribe = onSnapshot(
      q,
      this.createThrottledHandler(listenerId, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        options.onUpdate?.(comments)
        
        // Invalidate user comment queries
        if (this.queryClient) {
          this.queryClient.invalidateQueries({
            queryKey: queryKeys.comentariosByUser(userId)
          })
        }
      }),
      options.onError
    )
    
    const listenerInfo: ListenerInfo = {
      id: listenerId,
      unsubscribe,
      lastUpdate: Date.now(),
      updateCount: 0,
      isActive: true
    }
    
    this.listeners.set(listenerId, listenerInfo)
    
    return listenerId
  }
  
  /**
   * Subscribe to course statistics updates
   */
  subscribeToCourseStats(
    courseId: string,
    options: {
      onUpdate?: (stats: any) => void
      onError?: (error: Error) => void
    } = {}
  ): string {
    
    const listenerId = this.generateListenerId('course-stats', courseId)
    
    // Lighter query for stats - only count changes
    const q = query(
      collection(db, COLLECTIONS.COURSE_COMMENTS),
      where('courseId', '==', courseId)
    )
    
    const unsubscribe = onSnapshot(
      q,
      this.createThrottledHandler(listenerId, (snapshot) => {
        // Calculate stats from snapshot
        const docs = snapshot.docs
        const totalComments = docs.length
        const topLevelComments = docs.filter(doc => !doc.data().parentId).length
        const totalLikes = docs.reduce((sum, doc) => sum + (doc.data().likes || 0), 0)
        
        const stats = {
          totalComments: topLevelComments,
          totalReplies: totalComments - topLevelComments,
          totalInteractions: totalComments,
          totalLikes,
          updatedAt: Date.now()
        }
        
        options.onUpdate?.(stats)
        
        // Update cache
        if (this.queryClient) {
          this.queryClient.setQueryData(
            queryKeys.commentStats(courseId),
            stats
          )
        }
      }, 3000), // Longer throttle for stats
      options.onError
    )
    
    const listenerInfo: ListenerInfo = {
      id: listenerId,
      courseId,
      unsubscribe,
      lastUpdate: Date.now(),
      updateCount: 0,
      isActive: true
    }
    
    this.listeners.set(listenerId, listenerInfo)
    
    return listenerId
  }
  
  // === SMART UPDATE PROCESSING ===
  
  /**
   * Process document changes intelligently
   */
  private processDocumentChanges(courseId: string, changes: DocumentChange[]): void {
    if (changes.length === 0) return
    
    // Batch changes if enabled
    if (this.config.batchUpdates) {
      const existing = this.updateQueue.get(courseId) || []
      this.updateQueue.set(courseId, [...existing, ...changes])
      
      // Process batch after short delay
      setTimeout(() => this.processBatchedChanges(courseId), 100)
    } else {
      this.applyChanges(courseId, changes)
    }
  }
  
  /**
   * Process batched changes
   */
  private processBatchedChanges(courseId: string): void {
    const changes = this.updateQueue.get(courseId)
    if (!changes || changes.length === 0) return
    
    this.updateQueue.delete(courseId)
    this.applyChanges(courseId, changes)
  }
  
  /**
   * Apply changes to cache
   */
  private applyChanges(courseId: string, changes: DocumentChange[]): void {
    if (!this.queryClient) return
    
    // Group changes by type
    const additions = changes.filter(change => change.type === 'added')
    const modifications = changes.filter(change => change.type === 'modified')
    const removals = changes.filter(change => change.type === 'removed')
    
    // Update relevant query caches
    const queryKeysToUpdate = [
      queryKeys.optimizedCommentsByCurso(courseId),
      queryKeys.comentariosByCurso(courseId),
      queryKeys.commentsWithReplies(courseId)
    ]
    
    queryKeysToUpdate.forEach(queryKey => {
      this.queryClient!.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData
        
        let updatedComments = Array.isArray(oldData) ? [...oldData] : [...(oldData.comments || [])]
        
        // Apply removals
        removals.forEach(change => {
          updatedComments = updatedComments.filter(comment => comment.id !== change.doc.id)
        })
        
        // Apply additions
        additions.forEach(change => {
          const newComment = { id: change.doc.id, ...change.doc.data() }
          updatedComments.unshift(newComment) // Add to beginning
        })
        
        // Apply modifications
        modifications.forEach(change => {
          const updatedComment = { id: change.doc.id, ...change.doc.data() }
          const index = updatedComments.findIndex(comment => comment.id === change.doc.id)
          if (index !== -1) {
            updatedComments[index] = updatedComment
          }
        })
        
        // Sort comments (pinned first, then by date)
        updatedComments.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          return b.createdAt?.seconds - a.createdAt?.seconds
        })
        
        return Array.isArray(oldData) ? updatedComments : { ...oldData, comments: updatedComments }
      })
    })
  }
  
  // === THROTTLING & BATCHING ===
  
  /**
   * Create throttled update handler
   */
  private createThrottledHandler(
    listenerId: string, 
    handler: (snapshot: QuerySnapshot) => void,
    customThrottle?: number
  ) {
    const throttleMs = customThrottle || this.config.throttleMs
    
    return (snapshot: QuerySnapshot) => {
      // Clear existing timer
      const existingTimer = this.throttleTimers.get(listenerId)
      if (existingTimer) {
        clearTimeout(existingTimer)
      }
      
      // Set new timer
      const timer = setTimeout(() => {
        handler(snapshot)
        this.throttleTimers.delete(listenerId)
      }, throttleMs)
      
      this.throttleTimers.set(listenerId, timer)
    }
  }
  
  // === LISTENER MANAGEMENT ===
  
  /**
   * Unsubscribe from specific listener
   */
  unsubscribe(listenerId: string): boolean {
    const listener = this.listeners.get(listenerId)
    if (!listener) return false
    
    listener.unsubscribe()
    listener.isActive = false
    
    // Clear any pending throttle
    const timer = this.throttleTimers.get(listenerId)
    if (timer) {
      clearTimeout(timer)
      this.throttleTimers.delete(listenerId)
    }
    
    this.listeners.delete(listenerId)
    
    return true
  }
  
  /**
   * Unsubscribe from all course listeners
   */
  unsubscribeFromCourse(courseId: string): void {
    const courseListeners = Array.from(this.listeners.entries())
      .filter(([, listener]) => listener.courseId === courseId)
    
    courseListeners.forEach(([listenerId]) => {
      this.unsubscribe(listenerId)
    })
  }
  
  /**
   * Unsubscribe from all listeners
   */
  unsubscribeAll(): void {
    this.listeners.forEach((listener, listenerId) => {
      this.unsubscribe(listenerId)
    })
  }
  
  /**
   * Clean up oldest listener when limit reached
   */
  private cleanupOldestListener(): void {
    const listeners = Array.from(this.listeners.entries())
      .sort(([, a], [, b]) => a.lastUpdate - b.lastUpdate)
    
    if (listeners.length > 0) {
      this.unsubscribe(listeners[0][0])
    }
  }
  
  /**
   * Clean up inactive listeners
   */
  private cleanupInactiveListeners(): void {
    const now = Date.now()
    const inactiveThreshold = 10 * 60 * 1000 // 10 minutes
    
    const inactiveListeners = Array.from(this.listeners.entries())
      .filter(([, listener]) => 
        !listener.isActive || (now - listener.lastUpdate > inactiveThreshold)
      )
    
    inactiveListeners.forEach(([listenerId]) => {
      this.unsubscribe(listenerId)
    })
  }
  
  /**
   * Get listener ID for specific course
   */
  private getListenerIdForCourse(courseId: string): string | null {
    const entry = Array.from(this.listeners.entries())
      .find(([, listener]) => listener.courseId === courseId && listener.isActive)
    
    return entry ? entry[0] : null
  }
  
  /**
   * Schedule retry with exponential backoff
   */
  private scheduleRetry(listenerId: string, retryFn: () => void): void {
    const listener = this.listeners.get(listenerId)
    if (!listener) return
    
    const retryCount = listener.updateCount || 0
    const delay = Math.min(1000 * Math.pow(2, retryCount), 30000) // Max 30 seconds
    
    setTimeout(() => {
      if (this.listeners.has(listenerId)) {
        retryFn()
      }
    }, delay)
  }
  
  // === METRICS & MONITORING ===
  
  /**
   * Get real-time performance metrics
   */
  getMetrics(): {
    activeListeners: number
    totalUpdates: number
    avgUpdatesPerListener: number
    oldestListenerAge: number
  } {
    const listeners = Array.from(this.listeners.values()).filter(l => l.isActive)
    const now = Date.now()
    
    return {
      activeListeners: listeners.length,
      totalUpdates: listeners.reduce((sum, l) => sum + l.updateCount, 0),
      avgUpdatesPerListener: listeners.length > 0 
        ? listeners.reduce((sum, l) => sum + l.updateCount, 0) / listeners.length 
        : 0,
      oldestListenerAge: listeners.length > 0
        ? Math.max(...listeners.map(l => now - l.lastUpdate))
        : 0
    }
  }
}

// === SINGLETON INSTANCE ===
export const realtimeManager = new RealtimeOptimizationManager()

// === REACT HOOKS ===

import { useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'

/**
 * Hook for optimized real-time comments
 */
export const useRealtimeComments = (
  courseId: string,
  options: {
    enabled?: boolean
    throttle?: boolean
    onUpdate?: (comments: any[]) => void
  } = {}
) => {
  const queryClient = useQueryClient()
  const listenerIdRef = useRef<string>()
  
  useEffect(() => {
    realtimeManager.setQueryClient(queryClient)
  }, [queryClient])
  
  useEffect(() => {
    if (!courseId || options.enabled === false) return
    
    const listenerId = realtimeManager.subscribeToComments(courseId, {
      throttle: options.throttle,
      onUpdate: (comments) => {
        // Update query cache
        queryClient.setQueryData(
          queryKeys.optimizedCommentsByCurso(courseId),
          (old: any) => ({
            ...old,
            comments,
            hasMore: false
          })
        )
        
        options.onUpdate?.(comments)
      },
      onError: (error) => {
        console.error('Real-time comments error:', error)
      }
    })
    
    listenerIdRef.current = listenerId
    
    return () => {
      if (listenerId) {
        realtimeManager.unsubscribe(listenerId)
      }
    }
  }, [courseId, options.enabled, options.throttle, queryClient])
  
  return {
    unsubscribe: useCallback(() => {
      if (listenerIdRef.current) {
        realtimeManager.unsubscribe(listenerIdRef.current)
      }
    }, [])
  }
}

/**
 * Hook for real-time course statistics
 */
export const useRealtimeStats = (
  courseId: string,
  options: {
    enabled?: boolean
    onUpdate?: (stats: any) => void
  } = {}
) => {
  const queryClient = useQueryClient()
  const listenerIdRef = useRef<string>()
  
  useEffect(() => {
    if (!courseId || options.enabled === false) return
    
    realtimeManager.setQueryClient(queryClient)
    
    const listenerId = realtimeManager.subscribeToCourseStats(courseId, {
      onUpdate: options.onUpdate,
      onError: (error) => {
        console.error('Real-time stats error:', error)
      }
    })
    
    listenerIdRef.current = listenerId
    
    return () => {
      if (listenerId) {
        realtimeManager.unsubscribe(listenerId)
      }
    }
  }, [courseId, options.enabled, queryClient])
  
  return {
    unsubscribe: useCallback(() => {
      if (listenerIdRef.current) {
        realtimeManager.unsubscribe(listenerIdRef.current)
      }
    }, [])
  }
}

export default realtimeManager