import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import { onSnapshot, collection, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  getAllCommentsForCourse,
  getTopLevelCommentsForCourse,
  getRepliesForComment,
  getCommentsByUser,
  getPinnedCommentsForCourse,
  queryComments,
  getCommentsWithReplies,
  getCommentsByType,
  getVideoComments,
  getOpinionComments,
  getCommentStats,
  createCourseComment,
  updateCourseComment,
  deleteCourseComment,
  toggleCommentLike,
  toggleCommentPin,
  toggleCommentModeration,
  bulkModerateComments,
  bulkDeleteComments,
  canModerateComments,
  canPinComments,
  canEditComment,
  canDeleteComment
} from '@/api/Comments'
import { 
  CourseComment, 
  CreateCommentData, 
  UpdateCommentData,
  CommentWithReplies,
  CommentsQueryOptions 
} from '@/types'
import { useServerOptimizedQuery, useServerOptimizedMutation } from '@/hooks/core/useServerOptimizedQuery'
import { useMemo, useCallback, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

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
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache for debugging
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch on mount
    select: useCallback((data: CourseComment[]) => {
      console.log('🎯 SELECT processing data:', data?.length || 0)
      
      if (!data || !Array.isArray(data)) {
        console.log('⚠️ No data or not array')
        return []
      }
      
      // Sort by pinned first, then by creation date, and add computed properties
      const processed = data
        .sort((a, b) => {
          // Handle missing createdAt gracefully
          const aTime = a.createdAt?.seconds || 0
          const bTime = b.createdAt?.seconds || 0
          
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          return bTime - aTime
        })
        .map(comment => ({
          ...comment,
          // Add computed properties for UI
          timeAgo: comment.createdAt ? new Date(comment.createdAt.seconds * 1000) : new Date(),
          isLiked: false, // This would be computed based on current user
          canEdit: false, // This would be computed based on permissions
          canDelete: false, // This would be computed based on permissions
          canModerate: false, // This would be computed based on role
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
    staleTime: 0, // Always fresh for debugging
    gcTime: 0, // Don't cache
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
        .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds) // Replies chronological
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

// === MUTATION HOOKS (Write Operations) ===

/**
 * Create comment mutation with optimistic updates and role validation
 */
export const useCreateComment = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  return useServerOptimizedMutation<
    { id: string },
    CreateCommentData & {
      userId: string
      userName: string
      userRole: string
      userAvatar?: string
    }
  >({
    mutationFn: async (commentData) => {
      // Validate user permissions
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Validate data before sending
      if (!commentData.content?.trim()) {
        throw new Error('El contenido del comentario es requerido')
      }
      if (!commentData.courseId) {
        throw new Error('ID del curso es requerido')
      }

      const { userId, userName, userRole, userAvatar, ...createData } = commentData
      return await createCourseComment(createData, userId, userName, userRole, userAvatar)
    },
    optimisticUpdate: {
      queryKey: queryKeys.comentariosByCurso(''),
      updater: (oldData: CourseComment[] | undefined, variables) => {
        if (!oldData || !variables.courseId) return oldData || []
        
        const optimisticComment: CourseComment = {
          id: `temp-${Date.now()}`,
          courseId: variables.courseId,
          userId: variables.userId,
          userName: variables.userName,
          userRole: variables.userRole as any,
          userAvatar: variables.userAvatar,
          content: variables.content,
          parentId: variables.parentId || null,
          likes: 0,
          likedBy: [],
          isPinned: false,
          isModerated: false,
          isEdited: false,
          createdAt: { seconds: Math.floor(Date.now() / 1000) } as any,
          updatedAt: { seconds: Math.floor(Date.now() / 1000) } as any
        }
        
        return [optimisticComment, ...oldData]
      }
    },
    onSuccess: async (data, variables) => {
      // Invalidate relevant queries after successful comment creation
      const invalidationKeys = getInvalidationKeys.onComentarioCreate(
        undefined, // videoId - not used for course comments
        variables.courseId,
        variables.parentId || undefined
      )
      
      await Promise.all(
        invalidationKeys.map(queryKey => 
          queryClient.invalidateQueries({ queryKey })
        )
      )
      
      console.log('Comment created successfully:', data.id)
      
      // Additional success actions
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('comment-created', {
          detail: { 
            id: data.id, 
            courseId: variables.courseId,
            parentId: variables.parentId
          }
        }))
      }
    },
    onError: (error, variables) => {
      console.error('Error creating comment:', error, variables)
    }
  })
}

/**
 * Update comment mutation with edit tracking
 */
export const useUpdateComment = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    { id: string },
    { id: string; data: UpdateCommentData; courseId?: string }
  >({
    mutationFn: async ({ id, data, courseId }) => {
      // Validate user permissions
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Validate data
      if (!data.content?.trim()) {
        throw new Error('El contenido del comentario no puede estar vacío')
      }

      return await updateCourseComment(id, data)
    },
    optimisticUpdate: {
      queryKey: queryKeys.comentariosByCurso(''),
      updater: (oldData: CourseComment[] | undefined, { id, data }) => {
        if (!oldData) return []
        
        return oldData.map(comment => 
          comment.id === id 
            ? { 
                ...comment, 
                ...data, 
                isEdited: true,
                updatedAt: { seconds: Math.floor(Date.now() / 1000) } as any,
                editedAt: { seconds: Math.floor(Date.now() / 1000) } as any
              }
            : comment
        )
      }
    },
    onSuccess: async (data, { id, courseId }) => {
      console.log('Comment updated successfully:', id)

      // Update specific comment in cache
      const queryClient = useQueryClient()
      if (courseId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentariosByCurso(courseId) 
        })
      }
    },
    onError: (error, { id }) => {
      console.error('Error updating comment:', error, id)
    }
  })
}

/**
 * Delete comment mutation with cascade effects for replies
 */
export const useDeleteComment = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    { id: string },
    { id: string; courseId?: string; hasReplies?: boolean }
  >({
    mutationFn: async ({ id, hasReplies }) => {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Warn if comment has replies
      if (hasReplies) {
        const confirm = window?.confirm?.('Este comentario tiene respuestas. ¿Estás seguro de eliminarlo?')
        if (!confirm) {
          throw new Error('Eliminación cancelada')
        }
      }

      await deleteCourseComment(id)
      return { id }
    },
    optimisticUpdate: {
      queryKey: queryKeys.comentariosByCurso(''),
      updater: (oldData: CourseComment[] | undefined, { id }) => {
        if (!oldData) return []
        return oldData.filter(comment => comment.id !== id)
      }
    },
    onSuccess: async (data, { id, courseId }) => {
      console.log('Comment deleted successfully:', id)

      // Clean up related cache entries
      const queryClient = useQueryClient()
      queryClient.removeQueries({ queryKey: queryKeys.comentarioReplies(id) })
      
      if (courseId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentariosByCurso(courseId) 
        })
      }
    },
    onError: (error, { id }) => {
      console.error('Error deleting comment:', error, id)
    }
  })
}

/**
 * Like/unlike comment mutation with optimistic updates
 */
export const useLikeComment = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    CourseComment,
    { commentId: string; userId: string; courseId?: string }
  >({
    mutationFn: async ({ commentId, userId }) => {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      return await toggleCommentLike(commentId, userId)
    },
    optimisticUpdate: {
      queryKey: queryKeys.comentariosByCurso(''),
      updater: (oldData: CourseComment[] | undefined, { commentId, userId }) => {
        if (!oldData) return []
        
        return oldData.map(comment => {
          if (comment.id !== commentId) return comment
          
          const hasLiked = comment.likedBy?.includes(userId) || false
          const newLikedBy = hasLiked 
            ? comment.likedBy?.filter(id => id !== userId) || []
            : [...(comment.likedBy || []), userId]
          
          return {
            ...comment,
            likes: hasLiked ? Math.max(0, comment.likes - 1) : comment.likes + 1,
            likedBy: newLikedBy,
            updatedAt: { seconds: Math.floor(Date.now() / 1000) } as any
          }
        })
      }
    },
    onError: (error, { commentId }) => {
      console.error('Error toggling comment like:', error, commentId)
    }
  })
}

/**
 * Pin/unpin comment mutation (admin/instructor only)
 */
export const usePinComment = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    CourseComment,
    { commentId: string; isPinned: boolean; courseId?: string }
  >({
    mutationFn: async ({ commentId, isPinned }) => {
      if (!user || !canPinComments(user.role)) {
        throw new Error('No tienes permisos para anclar comentarios')
      }

      return await toggleCommentPin(commentId, isPinned)
    },
    optimisticUpdate: {
      queryKey: queryKeys.comentariosByCurso(''),
      updater: (oldData: CourseComment[] | undefined, { commentId, isPinned }) => {
        if (!oldData) return []
        
        return oldData.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                isPinned,
                updatedAt: { seconds: Math.floor(Date.now() / 1000) } as any
              }
            : comment
        )
      }
    },
    onSuccess: async (data, { commentId, courseId }) => {
      console.log('Comment pin status updated:', commentId)
      
      if (courseId) {
        const queryClient = useQueryClient()
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentariosByCurso(courseId) 
        })
      }
    }
  })
}

/**
 * Moderate comment mutation (admin/instructor only)
 */
export const useModerateComment = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    CourseComment,
    { commentId: string; isModerated: boolean; courseId?: string }
  >({
    mutationFn: async ({ commentId, isModerated }) => {
      if (!user || !canModerateComments(user.role)) {
        throw new Error('No tienes permisos para moderar comentarios')
      }

      return await toggleCommentModeration(commentId, isModerated)
    },
    optimisticUpdate: {
      queryKey: queryKeys.comentariosByCurso(''),
      updater: (oldData: CourseComment[] | undefined, { commentId, isModerated }) => {
        if (!oldData) return []
        
        return oldData.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                isModerated,
                updatedAt: { seconds: Math.floor(Date.now() / 1000) } as any
              }
            : comment
        )
      }
    }
  })
}

// === BULK OPERATIONS ===

/**
 * Bulk moderate comments mutation
 */
export const useBulkModerateComments = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    void,
    { commentIds: string[]; isModerated: boolean; courseId?: string }
  >({
    mutationFn: async ({ commentIds, isModerated }) => {
      if (!user || !canModerateComments(user.role)) {
        throw new Error('No tienes permisos para moderar comentarios')
      }

      await bulkModerateComments(commentIds, isModerated)
    },
    onSuccess: async (data, { courseId }) => {
      console.log('Bulk moderation completed')
      
      if (courseId) {
        const queryClient = useQueryClient()
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentariosByCurso(courseId) 
        })
      }
    }
  })
}

/**
 * Bulk delete comments mutation
 */
export const useBulkDeleteComments = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    void,
    { commentIds: string[]; courseId?: string }
  >({
    mutationFn: async ({ commentIds }) => {
      if (!user || !canModerateComments(user.role)) {
        throw new Error('No tienes permisos para eliminar comentarios')
      }

      await bulkDeleteComments(commentIds)
    },
    onSuccess: async (data, { commentIds, courseId }) => {
      console.log('Bulk deletion completed')
      
      const queryClient = useQueryClient()
      
      // Clean up reply cache for deleted comments
      commentIds.forEach(id => {
        queryClient.removeQueries({ queryKey: queryKeys.comentarioReplies(id) })
      })
      
      if (courseId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentariosByCurso(courseId) 
        })
      }
    }
  })
}

// === COMPOSITE HOOKS FOR COMMON WORKFLOWS ===

/**
 * All-in-one comment interactions hook
 */
export const useCommentInteractions = () => {
  const createMutation = useCreateComment()
  const updateMutation = useUpdateComment()
  const deleteMutation = useDeleteComment()
  const likeMutation = useLikeComment()
  const pinMutation = usePinComment()
  const moderateMutation = useModerateComment()

  return {
    // Comment CRUD (async versions)
    createComment: createMutation.mutateAsync,
    updateComment: updateMutation.mutateAsync,
    deleteComment: deleteMutation.mutateAsync,
    
    // Comment interactions (async versions)
    toggleLike: likeMutation.mutateAsync,
    togglePin: pinMutation.mutateAsync,
    toggleModeration: moderateMutation.mutateAsync,
    
    // Sync versions (for callbacks)
    createCommentSync: createMutation.mutate,
    updateCommentSync: updateMutation.mutate,
    deleteCommentSync: deleteMutation.mutate,
    
    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isLiking: likeMutation.isPending,
    isPinning: pinMutation.isPending,
    isModerating: moderateMutation.isPending,
    
    // Error states
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    likeError: likeMutation.error,
    pinError: pinMutation.error,
    moderateError: moderateMutation.error,
    
    // Reset functions
    resetCreate: createMutation.reset,
    resetUpdate: updateMutation.reset,
    resetDelete: deleteMutation.reset,
    resetLike: likeMutation.reset,
    resetPin: pinMutation.reset,
    resetModerate: moderateMutation.reset
  }
}

/**
 * Comprehensive comment management hook with real-time features
 */
export const useCommentManager = (courseId: string) => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  
  // Data hooks
  const commentsQuery = useGetCommentsWithReplies(courseId)
  const statsQuery = useGetCommentStats(courseId)
  const interactions = useCommentInteractions()

  // Permission calculations
  const canModerate = useMemo(() => 
    user ? canModerateComments(user.role) : false, 
    [user?.role]
  )
  
  const canPin = useMemo(() => 
    user ? canPinComments(user.role) : false, 
    [user?.role]
  )

  // Helper functions
  const refreshComments = useCallback(async () => {
    await Promise.all([
      commentsQuery.refetch(),
      statsQuery.refetch()
    ])
  }, [commentsQuery.refetch, statsQuery.refetch])

  const invalidateComments = useCallback(() => {
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.comentariosByCurso(courseId) 
    })
  }, [queryClient, courseId])

  const checkEditPermissions = useCallback((comment: CourseComment) => {
    if (!user) return false
    return canEditComment(comment, user.id, user.role)
  }, [user])

  const checkDeletePermissions = useCallback((comment: CourseComment) => {
    if (!user) return false
    return canDeleteComment(comment, user.id, user.role)
  }, [user])

  return {
    // Data
    comments: commentsQuery.data || [],
    stats: statsQuery.data || {
      totalComments: 0,
      totalReplies: 0,
      totalInteractions: 0,
      totalLikes: 0,
      pinnedComments: 0,
      moderatedComments: 0,
      averageLikesPerComment: 0
    },
    
    // Loading states
    isLoadingComments: commentsQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    
    // Error states
    commentsError: commentsQuery.error,
    statsError: statsQuery.error,
    
    // Permissions
    canModerate,
    canPin,
    checkEditPermissions,
    checkDeletePermissions,
    
    // Actions
    ...interactions,
    refreshComments,
    invalidateComments,
    
    // Query controls
    refetchComments: commentsQuery.refetch,
    refetchStats: statsQuery.refetch
  }
}

// === TYPE-SPECIFIC COMMENT HOOKS ===

/**
 * Get comments by type for a specific course
 */
export const useGetCommentsByType = (
  courseId: string, 
  commentType: 'opinion' | 'video' | 'general',
  enabled: boolean = true
) => {
  return useServerOptimizedQuery({
    queryKey: [...queryKeys.comentariosByCurso(courseId), 'type', commentType],
    queryFn: async () => {
      console.log('🎯 FETCHING COMMENTS BY TYPE:', { courseId, commentType })
      const result = await getCommentsByType(courseId, commentType)
      console.log('✅ Comments by type fetched:', result.length)
      return result
    },
    enabled: !!courseId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
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
 * Get video comments for specific content
 */
export const useGetVideoComments = (
  courseId: string,
  contentId: string,
  enabled: boolean = true
) => {
  return useServerOptimizedQuery({
    queryKey: [...queryKeys.comentariosByCurso(courseId), 'video', contentId],
    queryFn: async () => {
      console.log('📹 FETCHING VIDEO COMMENTS:', { courseId, contentId })
      const result = await getVideoComments(courseId, contentId)
      console.log('✅ Video comments fetched:', result.length)
      return result
    },
    enabled: !!courseId && !!contentId && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute - video comments change more frequently
    gcTime: 5 * 60 * 1000,
    select: useCallback((data: CourseComment[]) => {
      return data.map(comment => ({
        ...comment,
        timeAgo: new Date(comment.createdAt.seconds * 1000)
      }))
    }, [])
  })
}

/**
 * Get opinion comments for a course
 */
export const useGetOpinionComments = (
  courseId: string,
  enabled: boolean = true
) => {
  return useServerOptimizedQuery({
    queryKey: [...queryKeys.comentariosByCurso(courseId), 'opinions'],
    queryFn: async () => {
      console.log('💭 FETCHING OPINION COMMENTS:', courseId)
      const result = await getOpinionComments(courseId)
      console.log('✅ Opinion comments fetched:', result.length)
      return result
    },
    enabled: !!courseId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - opinions don't change as frequently
    gcTime: 15 * 60 * 1000,
    select: useCallback((data: CourseComment[]) => {
      return data.map(comment => ({
        ...comment,
        timeAgo: new Date(comment.createdAt.seconds * 1000)
      }))
    }, [])
  })
}

// === LEGACY COMPATIBILITY EXPORTS ===
// These maintain backward compatibility with existing useStandardizedHook patterns

export const useGetCourseCommentsV1 = (courseId: string) => {
  const query = useGetCourseComments(courseId)
  return {
    comments: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  }
}

export const useCreateCommentV1 = () => {
  const mutation = useCreateComment()
  return {
    mutate: mutation.mutate,
    data: mutation.data,
    loading: mutation.isPending,
    error: mutation.error
  }
}