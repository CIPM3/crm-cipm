import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { onSnapshot, collection, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  getAllCommentsForCourse,
  getTopLevelCommentsForCourse,
  getRepliesForComment,
  getCommentsByUser,
  getCommentsWithReplies,
  getCommentStats,
  queryComments,
  getVideoComments,
  getStandaloneVideoComments,
  getOpinionComments,
  getCommentsByType
} from '@/api/Comments'
import { 
  CourseComment, 
  CommentWithReplies,
  CommentsQueryOptions 
} from '@/types'
import { useServerOptimizedQuery } from '@/hooks/core/useServerOptimizedQuery'
import { useMemo, useCallback, useEffect } from 'react'

// === QUERY HOOKS (Read Operations) ===

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
        return [] as CourseComment[]
      }
    },
    enabled: !!courseId,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    select: useCallback((data: CourseComment[]) => {
      console.log('🎯 SELECT processing data:', data?.length || 0)
      
      if (!data || !Array.isArray(data)) {
        console.log('⚠️ No data or not array')
        return []
      }
      
      const processed = data
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0
          const bTime = b.createdAt?.seconds || 0
          
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          return bTime - aTime
        })
        .map(comment => ({
          ...comment,
          timeAgo: comment.createdAt ? new Date(comment.createdAt.seconds * 1000) : new Date(),
          isLiked: false,
          canEdit: false,
          canDelete: false,
          canModerate: false,
        }))
      
      console.log('✨ Final processed comments:', processed.length)
      return processed
    }, [])
  })
}

/**
 * Get comments with nested replies structure
 */
export const useGetCommentsWithReplies = (courseId: string) => {
  return useServerOptimizedQuery({
    queryKey: [...queryKeys.comentariosByCurso(courseId), 'with-replies'],
    queryFn: async () => {
      console.log('🔗 FETCHING COMMENTS WITH REPLIES for course:', courseId)
      const result = await getCommentsWithReplies(courseId)
      console.log('✅ Comments with replies fetched:', result.length)
      console.log('📝 First comment with replies:', result[0])
      return result
    },
    enabled: !!courseId,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    select: useCallback((data: CommentWithReplies[]) => {
      console.log('🎯 SELECT processing comments with replies:', data?.length || 0)
      
      if (!data || !Array.isArray(data)) {
        return []
      }
      
      const processed = data.map(comment => ({
        ...comment,
        timeAgo: new Date(comment.createdAt.seconds * 1000),
        replies: comment.replies?.map(reply => ({
          ...reply,
          timeAgo: new Date(reply.createdAt.seconds * 1000)
        })) || []
      }))
      
      console.log('✨ Final processed comments with replies:', processed.length)
      return processed
    }, [])
  })
}

/**
 * Get comment replies for a specific parent comment
 */
export const useGetCommentReplies = (parentId: string, enabled: boolean = true) => {
  return useServerOptimizedQuery({
    queryKey: queryKeys.comentarioReplies(parentId),
    queryFn: async () => {
      return await getRepliesForComment(parentId)
    },
    enabled: !!parentId && enabled,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    select: useCallback((data: CourseComment[]) => {
      return data
        .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds)
        .map(reply => ({
          ...reply,
          timeAgo: new Date(reply.createdAt.seconds * 1000)
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
    staleTime: 5 * 60 * 1000,
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
    staleTime: 5 * 60 * 1000,
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

/**
 * Hook for getting video-specific comments (both course videos and standalone videos)
 */
export const useGetVideoComments = (videoId: string, courseId?: string, isStandalone: boolean = false) => {
  const queryKey = isStandalone
    ? ['comentarios', 'standalone-video', videoId]
    : [...queryKeys.comentariosByCurso(courseId || ''), 'video', videoId]

  return useServerOptimizedQuery({
    queryKey,
    queryFn: async () => {
      if (isStandalone) {
        return await getStandaloneVideoComments(videoId)
      } else {
        return await getVideoComments(videoId, courseId)
      }
    },
    enabled: !!videoId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    select: useCallback((data: CourseComment[]) => {
      return data
        .sort((a, b) => {
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
 * Hook for getting standalone video comments (not part of a course)
 */
export const useGetStandaloneVideoComments = (
  videoId: string,
  options?: { limit?: number }
) => {
  return useServerOptimizedQuery({
    queryKey: ['comentarios', 'standalone-video', videoId],
    queryFn: () => getStandaloneVideoComments(videoId, options),
    enabled: !!videoId,
    staleTime: 30000
  })
}

/**
 * Hook for getting opinion/review comments for a course
 */
export const useGetOpinionComments = (courseId: string) => {
  return useServerOptimizedQuery({
    queryKey: [...queryKeys.comentariosByCurso(courseId), 'opinions'],
    queryFn: async () => {
      return await getOpinionComments(courseId)
    },
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: useCallback((data: CourseComment[]) => {
      return data
        .sort((a, b) => {
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

