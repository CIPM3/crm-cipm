// === ULTRA-OPTIMIZED COMMENTS HOOKS ===
// Provides maximum performance with intelligent caching, mobile optimization, and real-time updates

import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useMobileOptimizedQuery, useMobile } from '@/hooks/core/useMobileOptimizedQuery'
import {
  getOptimizedCourseComments,
  createOptimizedComment,
  toggleOptimizedLike,
  getOptimizedCommentsWithReplies,
  bulkOptimizedActions,
  mobileOptimizations,
  cacheManager
} from '@/lib/services/comments-optimized'
import {
  updateCourseComment,
  deleteCourseComment,
  toggleCommentPin,
  toggleCommentModeration
} from '@/lib/services/comments'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/store/useAuthStore'
import { CourseComment, CreateCommentData } from '@/types'
import { useCallback, useMemo, useEffect } from 'react'
import { onSnapshot, collection, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { COLLECTIONS } from '@/lib/constants'

// === OPTIMIZED QUERY HOOKS ===

/**
 * Ultra-fast comments hook with mobile optimization and real-time updates
 */
export const useOptimizedCourseComments = (
  courseId: string,
  options: {
    topLevelOnly?: boolean
    includeStats?: boolean
    realTime?: boolean
    preload?: boolean
  } = {}
) => {
  const mobile = useMobile()
  const queryClient = useQueryClient()
  
  // Preload comments for instant access
  useEffect(() => {
    if (options.preload && courseId) {
      cacheManager.preloadComments(courseId)
    }
  }, [courseId, options.preload])
  
  // Real-time listener for live updates
  useEffect(() => {
    if (!options.realTime || !courseId) return
    
    // Throttled real-time updates for mobile
    let updateTimeout: NodeJS.Timeout
    
    const commentsRef = collection(db, COLLECTIONS.COURSE_COMMENTS)
    const q = query(commentsRef, where('courseId', '==', courseId))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Throttle updates on mobile to prevent excessive re-renders
      if (mobile) {
        clearTimeout(updateTimeout)
        updateTimeout = setTimeout(() => {
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.comentariosByCurso(courseId) 
          })
        }, 1000) // 1 second throttle on mobile
      } else {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentariosByCurso(courseId) 
        })
      }
    }, (error) => {
      console.error('Real-time comments error:', error)
    })
    
    return () => {
      unsubscribe()
      clearTimeout(updateTimeout)
    }
  }, [courseId, options.realTime, mobile, queryClient])
  
  return useMobileOptimizedQuery({
    queryKey: queryKeys.optimizedCommentsByCurso(courseId),
    queryFn: async () => {
      const result = await getOptimizedCourseComments(courseId, {
        topLevelOnly: options.topLevelOnly,
        includeStats: options.includeStats,
        limit: mobile ? 10 : 20
      })
      
      return result
    },
    enabled: !!courseId,
    mobileConfig: {
      reducedStaleTime: 30 * 1000, // 30 seconds on mobile
      reducedGcTime: 2 * 60 * 1000, // 2 minutes on mobile
      limitDataSize: true,
      backgroundSync: true,
      preloadOnIdle: true
    },
    select: useCallback((data: any) => {
      if (!data?.comments) return { comments: [], hasMore: false, stats: null }
      
      // Sort comments optimally
      const sortedComments = data.comments.sort((a: CourseComment, b: CourseComment) => {
        // Pinned comments first
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        
        // Then by creation date (newest first)
        return b.createdAt.seconds - a.createdAt.seconds
      })
      
      // Add time formatting for mobile efficiency
      const optimizedComments = sortedComments.map((comment: CourseComment) => ({
        ...comment,
        timeAgo: formatTimeAgo(comment.createdAt),
        isOwn: comment.userId === useAuthStore.getState().user?.id
      }))
      
      return {
        ...data,
        comments: optimizedComments
      }
    }, [])
  })
}

/**
 * Infinite scroll comments for mobile performance
 */
export const useInfiniteOptimizedComments = (courseId: string) => {
  const mobile = useMobile()
  
  return useInfiniteQuery({
    queryKey: queryKeys.infiniteCommentsByCurso(courseId),
    queryFn: async ({ pageParam = null }) => {
      return await getOptimizedCourseComments(courseId, {
        cursor: pageParam,
        limit: mobile ? 10 : 20
      })
    },
    enabled: !!courseId,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: mobile ? 30 * 1000 : 2 * 60 * 1000,
    gcTime: mobile ? 2 * 60 * 1000 : 10 * 60 * 1000,
    select: useCallback((data: any) => {
      const allComments = data.pages.flatMap((page: any) => page.comments || [])
      
      return {
        ...data,
        comments: allComments,
        totalCount: allComments.length
      }
    }, [])
  })
}

/**
 * Comments with replies - optimized for mobile
 */
export const useOptimizedCommentsWithReplies = (courseId: string) => {
  const mobile = useMobile()
  
  return useMobileOptimizedQuery({
    queryKey: queryKeys.commentsWithReplies(courseId),
    queryFn: () => getOptimizedCommentsWithReplies(courseId),
    enabled: !!courseId,
    mobileConfig: {
      reducedStaleTime: 60 * 1000, // 1 minute
      reducedGcTime: 5 * 60 * 1000, // 5 minutes
      limitDataSize: true
    },
    select: useCallback((data: any[]) => {
      if (!Array.isArray(data)) return []
      
      return data.map(comment => ({
        ...comment,
        timeAgo: formatTimeAgo(comment.createdAt),
        replies: comment.replies?.map((reply: CourseComment) => ({
          ...reply,
          timeAgo: formatTimeAgo(reply.createdAt)
        })) || []
      }))
    }, [])
  })
}

// === OPTIMIZED MUTATION HOOKS ===

/**
 * Ultra-fast comment creation with optimistic updates
 */
export const useOptimizedCreateComment = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const mobile = useMobile()
  
  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      if (!user) throw new Error('Usuario no autenticado')
      
      // Mobile-specific validation
      if (mobile && data.content.length > 500) {
        throw new Error('Comentario muy largo para móvil (máximo 500 caracteres)')
      }
      
      const enrichedData = {
        ...data,
        userId: user.id,
        userName: user.name || user.email || 'Usuario',
        userRole: user.role || 'cliente',
        userAvatar: user.avatar
      }
      
      // Use optimized service
      const result = await createOptimizedComment(enrichedData)
      
      // Queue for offline sync on mobile
      if (mobile) {
        mobileOptimizations.queueForSync('createComment', enrichedData)
      }
      
      return result
    },
    onMutate: async (newComment) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.comentariosByCurso(newComment.courseId) 
      })
      
      // Create optimistic comment
      const optimisticComment: CourseComment = {
        id: `optimistic_${Date.now()}`,
        courseId: newComment.courseId,
        userId: user?.id || '',
        userName: user?.name || 'Usuario',
        userRole: user?.role as any || 'cliente',
        userAvatar: user?.avatar,
        content: newComment.content.trim(),
        parentId: newComment.parentId || null,
        likes: 0,
        likedBy: [],
        isPinned: false,
        isModerated: false,
        isEdited: false,
        createdAt: { seconds: Date.now() / 1000 } as any,
        updatedAt: { seconds: Date.now() / 1000 } as any,
        timeAgo: 'ahora'
      }
      
      // Optimistically update cache
      queryClient.setQueryData(
        queryKeys.optimizedCommentsByCurso(newComment.courseId),
        (old: any) => {
          if (!old?.comments) return { comments: [optimisticComment], hasMore: false }
          
          return {
            ...old,
            comments: [optimisticComment, ...old.comments]
          }
        }
      )
      
      return { optimisticComment }
    },
    onError: (error, newComment, context) => {
      console.error('Failed to create comment:', error)
      
      // Revert optimistic update
      if (context?.optimisticComment) {
        queryClient.setQueryData(
          queryKeys.optimizedCommentsByCurso(newComment.courseId),
          (old: any) => {
            if (!old?.comments) return old
            
            return {
              ...old,
              comments: old.comments.filter((c: CourseComment) => 
                c.id !== context.optimisticComment.id
              )
            }
          }
        )
      }
    },
    onSuccess: (result, newComment) => {
      // Update cache with real comment
      queryClient.setQueryData(
        queryKeys.optimizedCommentsByCurso(newComment.courseId),
        (old: any) => {
          if (!old?.comments) return { comments: [result.comment], hasMore: false }
          
          return {
            ...old,
            comments: old.comments.map((c: CourseComment) => 
              c.id === result.tempId ? result.comment : c
            )
          }
        }
      )
      
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.commentStats(newComment.courseId) 
      })
    }
  })
}

/**
 * Ultra-fast like toggle with optimistic updates
 */
export const useOptimizedToggleLike = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const mobile = useMobile()
  
  return useMutation({
    mutationFn: async ({ commentId, courseId }: { commentId: string; courseId: string }) => {
      if (!user?.id) throw new Error('Usuario no autenticado')
      
      const result = await toggleOptimizedLike(commentId, user.id)
      
      // Queue for offline sync on mobile
      if (mobile) {
        mobileOptimizations.queueForSync('toggleLike', { commentId, userId: user.id })
      }
      
      return { ...result, commentId, courseId }
    },
    onMutate: async ({ commentId, courseId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.optimizedCommentsByCurso(courseId) 
      })
      
      // Optimistically update like status
      queryClient.setQueryData(
        queryKeys.optimizedCommentsByCurso(courseId),
        (old: any) => {
          if (!old?.comments) return old
          
          return {
            ...old,
            comments: old.comments.map((comment: CourseComment) => {
              if (comment.id !== commentId) return comment
              
              const currentlyLiked = comment.likedBy?.includes(user?.id || '') || false
              const newLikes = currentlyLiked 
                ? Math.max(0, comment.likes - 1)
                : comment.likes + 1
              
              return {
                ...comment,
                likes: newLikes,
                likedBy: currentlyLiked
                  ? comment.likedBy?.filter(id => id !== user?.id) || []
                  : [...(comment.likedBy || []), user?.id || '']
              }
            })
          }
        }
      )
      
      return { commentId, courseId }
    },
    onError: (error, variables, context) => {
      console.error('Failed to toggle like:', error)
      
      // Revert optimistic update on error
      if (context) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.optimizedCommentsByCurso(context.courseId) 
        })
      }
    }
  })
}

/**
 * Bulk operations for admin users
 */
export const useBulkCommentActions = () => {
  const queryClient = useQueryClient()
  
  return {
    moderateComments: useMutation({
      mutationFn: ({ commentIds, isModerated }: { commentIds: string[]; isModerated: boolean }) =>
        bulkOptimizedActions.moderateComments(commentIds, isModerated),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.comentarios() })
      }
    }),
    
    deleteComments: useMutation({
      mutationFn: (commentIds: string[]) =>
        bulkOptimizedActions.deleteComments(commentIds),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.comentarios() })
      }
    })
  }
}

// === UTILITY FUNCTIONS ===

/**
 * Optimized time formatting for mobile
 */
const formatTimeAgo = (timestamp: any): string => {
  try {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'ahora'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`
    
    return date.toLocaleDateString()
  } catch {
    return 'unknown'
  }
}

/**
 * Smart cache invalidation
 */
export const useSmartCacheInvalidation = (courseId: string) => {
  const queryClient = useQueryClient()
  
  return useCallback((patterns: string[] = []) => {
    const keysToInvalidate = cacheManager.invalidateCommentCache(courseId, patterns)
    
    keysToInvalidate.forEach(key => {
      queryClient.invalidateQueries({ queryKey: key })
    })
  }, [courseId, queryClient])
}

// === ENHANCED QUERY KEYS ===
declare module '@/lib/queryKeys' {
  interface QueryKeys {
    optimizedCommentsByCurso: (courseId: string) => string[]
    infiniteCommentsByCurso: (courseId: string) => string[]
    commentsWithReplies: (courseId: string) => string[]
    commentStats: (courseId: string) => string[]
  }
}

// Extend queryKeys object
Object.assign(queryKeys, {
  optimizedCommentsByCurso: (courseId: string) => ['optimized-comments', courseId],
  infiniteCommentsByCurso: (courseId: string) => ['infinite-comments', courseId],
  commentsWithReplies: (courseId: string) => ['comments-with-replies', courseId],
  commentStats: (courseId: string) => ['comment-stats', courseId]
})

export default {
  useOptimizedCourseComments,
  useInfiniteOptimizedComments,
  useOptimizedCommentsWithReplies,
  useOptimizedCreateComment,
  useOptimizedToggleLike,
  useBulkCommentActions,
  useSmartCacheInvalidation
}