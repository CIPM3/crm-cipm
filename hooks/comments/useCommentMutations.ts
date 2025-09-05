import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { 
  createCourseComment,
  updateCourseComment,
  deleteCourseComment,
  toggleCommentLike,
  toggleCommentPin,
  toggleCommentModeration
} from '@/api/Comments'
import { 
  CourseComment, 
  CreateCommentData, 
  UpdateCommentData
} from '@/types'
import { useServerOptimizedMutation } from '@/hooks/core/useServerOptimizedQuery'
import { useAuthStore } from '@/store/useAuthStore'

// === MUTATION HOOKS (Write Operations) ===

/**
 * Create comment mutation with optimistic updates and role validation
 */
export const useCreateComment = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  return useServerOptimizedMutation<
    CourseComment,
    CreateCommentData & { courseId?: string }
  >({
    mutationFn: async (data) => {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Enhanced validation
      if (!data.content?.trim()) {
        throw new Error('El contenido del comentario no puede estar vacío')
      }

      if (data.content.length > 2000) {
        throw new Error('El comentario no puede exceder 2000 caracteres')
      }

      const commentData: CreateCommentData = {
        ...data,
        userId: user.id,
        userName: user.name || user.email || 'Usuario',
        userRole: user.role || 'cliente',
        userAvatar: user.avatar
      }

      console.log('Creating comment with data:', commentData)
      const result = await createCourseComment(commentData)
      console.log('Comment creation result:', result)

      return result
    },
    optimisticUpdate: {
      queryKey: queryKeys.comentariosByCurso(''),
      updater: (oldData: CourseComment[] | undefined, newComment) => {
        if (!oldData) return []
        
        const optimisticComment: CourseComment = {
          id: `temp-${Date.now()}`,
          ...newComment,
          createdAt: { seconds: Math.floor(Date.now() / 1000) } as any,
          updatedAt: { seconds: Math.floor(Date.now() / 1000) } as any,
          likes: 0,
          likedBy: [],
          isPinned: false,
          isModerated: false
        }
        
        return [optimisticComment, ...oldData]
      }
    },
    onSuccess: async (data, variables) => {
      console.log('Comment created successfully:', data.id)
      
      // Invalidate related queries
      if (variables.courseId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentariosByCurso(variables.courseId) 
        })
        
        // Also invalidate stats
        queryClient.invalidateQueries({ 
          queryKey: [...queryKeys.comentariosByCurso(variables.courseId), 'stats'] 
        })
      }
      
      // Invalidate parent comment if this is a reply
      if (variables.parentId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentarioReplies(variables.parentId) 
        })
      }
    },
    onError: (error, variables) => {
      console.error('Error creating comment:', error, variables)
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      // You might want to use a toast notification here instead
      console.error('Comment creation failed:', errorMessage)
    }
  })
}

/**
 * Update comment mutation with validation and optimistic updates
 */
export const useUpdateComment = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    CourseComment,
    { id: string; data: UpdateCommentData; courseId?: string }
  >({
    mutationFn: async ({ id, data }) => {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Validate data
      if (!data.content?.trim()) {
        throw new Error('El contenido del comentario no puede estar vacío')
      }

      if (data.content.length > 2000) {
        throw new Error('El comentario no puede exceder 2000 caracteres')
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
        
        // Also invalidate stats
        queryClient.invalidateQueries({ 
          queryKey: [...queryKeys.comentariosByCurso(courseId), 'stats'] 
        })
      }
    },
    onError: (error, { id }) => {
      console.error('Error deleting comment:', error, id)
    }
  })
}

/**
 * Like/unlike comment mutation with optimistic updates and mobile haptic feedback
 */
export const useLikeComment = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    { commentId: string; hasLiked: boolean; newLikeCount: number },
    { commentId: string; userId: string; courseId: string }
  >({
    mutationFn: async ({ commentId, userId, courseId }) => {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      const result = await toggleCommentLike(commentId, userId)
      
      // Add haptic feedback for mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      return {
        commentId,
        hasLiked: result.hasLiked,
        newLikeCount: result.newLikeCount
      }
    },
    optimisticUpdate: {
      queryKey: queryKeys.comentariosByCurso(''),
      updater: (oldData: CourseComment[] | undefined, { commentId, userId }) => {
        if (!oldData) return []
        
        return oldData.map(comment => {
          if (comment.id === commentId) {
            const hasLiked = comment.likedBy?.includes(userId) || false
            const likedBy = hasLiked 
              ? comment.likedBy?.filter(id => id !== userId) || []
              : [...(comment.likedBy || []), userId]
            
            return {
              ...comment,
              likes: hasLiked ? (comment.likes || 1) - 1 : (comment.likes || 0) + 1,
              likedBy
            }
          }
          return comment
        })
      }
    },
    onSuccess: async (data, { courseId }) => {
      console.log('Comment like toggled:', data)
      
      // Don't invalidate queries for likes to keep smooth UX
      // The optimistic update should handle the UI changes
    },
    onError: (error, { commentId, courseId }) => {
      console.error('Error toggling like:', error, commentId)
      
      // On error, invalidate to restore correct state
      const queryClient = useQueryClient()
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.comentariosByCurso(courseId) 
      })
    }
  })
}

/**
 * Pin/unpin comment mutation (moderator only)
 */
export const usePinComment = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    { commentId: string; isPinned: boolean },
    { commentId: string; isPinned: boolean; courseId: string }
  >({
    mutationFn: async ({ commentId, isPinned }) => {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      await toggleCommentPin(commentId, isPinned)
      return { commentId, isPinned }
    },
    optimisticUpdate: {
      queryKey: queryKeys.comentariosByCurso(''),
      updater: (oldData: CourseComment[] | undefined, { commentId, isPinned }) => {
        if (!oldData) return []
        
        return oldData.map(comment => 
          comment.id === commentId 
            ? { ...comment, isPinned }
            : comment
        )
      }
    },
    onSuccess: async (data, { courseId }) => {
      console.log('Comment pin toggled:', data)
      
      // Force refetch to ensure proper sorting with pinned comments
      const queryClient = useQueryClient()
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.comentariosByCurso(courseId) 
      })
    },
    onError: (error, { commentId }) => {
      console.error('Error toggling pin:', error, commentId)
    }
  })
}

/**
 * Moderate comment mutation (admin/instructor only)
 */
export const useModerateComment = () => {
  const { user } = useAuthStore()

  return useServerOptimizedMutation<
    { commentId: string; isModerated: boolean },
    { commentId: string; isModerated: boolean; courseId: string }
  >({
    mutationFn: async ({ commentId, isModerated }) => {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      await toggleCommentModeration(commentId, isModerated)
      return { commentId, isModerated }
    },
    optimisticUpdate: {
      queryKey: queryKeys.comentariosByCurso(''),
      updater: (oldData: CourseComment[] | undefined, { commentId, isModerated }) => {
        if (!oldData) return []
        
        return isModerated 
          ? oldData.filter(comment => comment.id !== commentId) // Hide moderated comments immediately
          : oldData.map(comment => 
              comment.id === commentId 
                ? { ...comment, isModerated }
                : comment
            )
      }
    },
    onSuccess: async (data, { courseId }) => {
      console.log('Comment moderation toggled:', data)
      
      const queryClient = useQueryClient()
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.comentariosByCurso(courseId) 
      })
    },
    onError: (error, { commentId }) => {
      console.error('Error toggling moderation:', error, commentId)
    }
  })
}