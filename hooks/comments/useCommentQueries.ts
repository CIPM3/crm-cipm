import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { onSnapshot, collection, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  getAllCommentsForCourse,
  getTopLevelCommentsForCourse,
  getRepliesForComment,
  getCommentsByUser,
  getPinnedCommentsForCourse,
  queryComments,
  getCommentStats
} from '@/api/Comments'
import { 
  CourseComment, 
  CommentsQueryOptions 
} from '@/types'
import { useServerOptimizedQuery } from '@/hooks/core/useServerOptimizedQuery'
import { useMemo, useCallback, useEffect } from 'react'

// === QUERY HOOKS (Read Operations) ===

/**
 * Real-time comment observer hook
 * Sets up Firebase listener to invalidate queries when comments change
 */
export const useCommentsObserver = (courseId: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!courseId) return

    // Create Firebase query for this course's comments
    const commentsRef = collection(db, 'CourseComments')
    const q = query(commentsRef, where('courseId', '==', courseId))

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Invalidate comments queries to trigger refetch
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.comentariosByCurso(courseId) 
      })
    })

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [courseId, queryClient])
}

/**
 * Enhanced hook for getting course comments with filters and performance optimization
 */
export const useGetCourseComments = (
  courseId: string,
  options?: {
    topLevelOnly?: boolean
    pinnedOnly?: boolean
    limit?: number
    userId?: string
  }
) => {
  const memoizedOptions = useMemo(() => ({
    courseId,
    ...options
  }), [courseId, options?.topLevelOnly, options?.pinnedOnly, options?.limit, options?.userId])

  return useServerOptimizedQuery({
    queryKey: queryKeys.comentariosByCurso(courseId),
    queryFn: async () => {
      console.log('🔥 FETCHING COMMENTS for course:', courseId)
      try {
        const result = await getAllCommentsForCourse(courseId)
        console.log('✅ Comments fetched:', result.length)
        console.log('📝 First comment:', result[0])
        return result
      } catch (error: any) {
        console.error('❌ Error fetching comments:', error)
        // Return empty array as fallback to prevent UI crashes
        return [] as CourseComment[]
      }
    },
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes - optimized for better performance
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error: any) => {
      // Don't retry if it's an auth error
      if (error?.code === 'auth/unauthorized') return false
      return failureCount < 2
    },
    select: useCallback((data: CourseComment[]) => {
      if (!data?.length) return []
      
      return data
        .sort((a, b) => {
          // Pinned comments first
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          
          // Then by creation date (newest first)
          return b.createdAt.seconds - a.createdAt.seconds
        })
        .map(comment => ({
          ...comment,
          timeAgo: new Date(comment.createdAt.seconds * 1000)
        }))
    }, [])
  })
}

/**
 * Get top-level comments only (no replies)
 */
export const useGetTopLevelComments = (courseId: string, limit?: number) => {
  return useServerOptimizedQuery({
    queryKey: [...queryKeys.comentariosByCurso(courseId), 'topLevel', limit],
    queryFn: async () => {
      return await getTopLevelCommentsForCourse(courseId, limit)
    },
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: useCallback((data: CourseComment[]) => {
      return data
        .sort((a, b) => {
          // Pinned first
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          return b.createdAt.seconds - a.createdAt.seconds
        })
        .map(comment => ({
          ...comment,
          timeAgo: new Date(comment.createdAt.seconds * 1000)
        }))
    }, [])
  })
}

/**
 * Get replies for a specific comment
 */
export const useGetCommentReplies = (parentId: string) => {
  return useServerOptimizedQuery({
    queryKey: queryKeys.comentarioReplies(parentId),
    queryFn: async () => {
      return await getRepliesForComment(parentId)
    },
    enabled: !!parentId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: useCallback((data: CourseComment[]) => {
      return data
        .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds) // Oldest replies first
        .map(comment => ({
          ...comment,
          timeAgo: new Date(comment.createdAt.seconds * 1000)
        }))
    }, [])
  })
}

/**
 * Get pinned comments for a course
 */
export const useGetPinnedComments = (courseId: string) => {
  return useServerOptimizedQuery({
    queryKey: [...queryKeys.comentariosByCurso(courseId), 'pinned'],
    queryFn: async () => {
      return await getPinnedCommentsForCourse(courseId)
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes - pinned comments change less frequently
    gcTime: 15 * 60 * 1000,
    select: useCallback((data: CourseComment[]) => {
      return data
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
        .map(comment => ({
          ...comment,
          timeAgo: new Date(comment.createdAt.seconds * 1000)
        }))
    }, [])
  })
}

/**
 * Get user's comments across all courses or specific course
 */
export const useGetUserComments = (userId: string, courseId?: string) => {
  const queryKey = courseId 
    ? [...queryKeys.comentariosByCurso(courseId), 'user', userId]
    : [...queryKeys.comentarios(), 'user', userId]

  return useServerOptimizedQuery({
    queryKey,
    queryFn: async () => {
      return await getCommentsByUser(userId, courseId)
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes - user's own comments don't change as frequently
    gcTime: 15 * 60 * 1000,
    select: useCallback((data: CourseComment[]) => {
      return data
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
        .map(comment => ({
          ...comment,
          timeAgo: new Date(comment.createdAt.seconds * 1000)
        }))
    }, [])
  })
}

/**
 * Get comment statistics for a course
 */
export const useGetCommentStats = (courseId: string) => {
  return useServerOptimizedQuery({
    queryKey: [...queryKeys.comentariosByCurso(courseId), 'stats'],
    queryFn: async () => {
      try {
        return await getCommentStats(courseId)
      } catch (error: any) {
        console.error('Error fetching comment stats, returning defaults:', error)
        // Return default stats as fallback
        return {
          totalComments: 0,
          totalReplies: 0,
          totalInteractions: 0,
          totalLikes: 0,
          pinnedComments: 0,
          moderatedComments: 0,
          averageLikesPerComment: 0
        }
      }
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change that frequently
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

/**
 * Advanced query with multiple filters and options
 */
export const useQueryComments = (options: CommentsQueryOptions) => {
  const memoizedOptions = useMemo(() => options, [
    options.courseId,
    options.parentId,
    options.userId,
    options.isPinned,
    options.limit,
    options.orderBy,
    options.order
  ])

  return useServerOptimizedQuery({
    queryKey: [...queryKeys.comentarios(), 'filtered', memoizedOptions],
    queryFn: async () => {
      return await queryComments(memoizedOptions)
    },
    enabled: !!(memoizedOptions.courseId || memoizedOptions.userId),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: useCallback((data: CourseComment[]) => {
      return data.map(comment => ({
        ...comment,
        timeAgo: new Date(comment.createdAt.seconds * 1000)
      }))
    }, [])
  })
}