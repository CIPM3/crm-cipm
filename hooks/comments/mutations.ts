import { useQueryClient } from '@tanstack/react-query'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import {
  createCourseComment,
  updateCourseComment,
  deleteCourseComment,
  toggleCommentLike,
  toggleCommentPin,
  toggleCommentModeration,
  bulkModerateComments,
  bulkDeleteComments,
  canModerateComments,
  canPinComments
} from '@/api/Comments'
import { CreateCommentData, UpdateCommentData, CourseComment } from '@/types'
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
    { id: string },
    CreateCommentData & {
      userId: string
      userName: string
      userRole: string
      userAvatar?: string
    }
  >({
    mutationFn: async (commentData) => {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

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
      const invalidationKeys = getInvalidationKeys.onComentarioCreate(
        undefined,
        variables.courseId,
        variables.parentId || undefined
      )
      
      await Promise.all(
        invalidationKeys.map(queryKey => 
          queryClient.invalidateQueries({ queryKey })
        )
      )
      
      console.log('Comment created successfully:', data.id)
      
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
    mutationFn: async ({ id, data }) => {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

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
    },
    onSuccess: async (data, { commentId, courseId }) => {
      console.log('Comment moderation status updated:', commentId)
      
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
 * Bulk moderate comments mutation (admin only)
 */
export const useBulkModerateComments = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  return useServerOptimizedMutation<
    { moderated: number },
    { commentIds: string[]; isModerated: boolean; courseId?: string }
  >({
    mutationFn: async ({ commentIds, isModerated }) => {
      if (!user || !canModerateComments(user.role)) {
        throw new Error('No tienes permisos para moderar comentarios')
      }

      await bulkModerateComments(commentIds, isModerated)
      return { moderated: commentIds.length }
    },
    onSuccess: async (data, { courseId }) => {
      console.log('Bulk moderation completed:', data.moderated)
      
      if (courseId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentariosByCurso(courseId) 
        })
      }
    }
  })
}

/**
 * Bulk delete comments mutation (admin only)
 */
export const useBulkDeleteComments = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  return useServerOptimizedMutation<
    { deleted: number },
    { commentIds: string[]; courseId?: string }
  >({
    mutationFn: async ({ commentIds }) => {
      if (!user || !canModerateComments(user.role)) {
        throw new Error('No tienes permisos para eliminar comentarios')
      }

      const confirm = window?.confirm?.(`¿Estás seguro de eliminar ${commentIds.length} comentarios?`)
      if (!confirm) {
        throw new Error('Eliminación cancelada')
      }

      await bulkDeleteComments(commentIds)
      return { deleted: commentIds.length }
    },
    onSuccess: async (data, { courseId }) => {
      console.log('Bulk deletion completed:', data.deleted)
      
      if (courseId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentariosByCurso(courseId) 
        })
      }
    }
  })
}

// Legacy aliases for backward compatibility
export const useToggleCommentLike = useLikeComment
export const useToggleCommentPin = usePinComment
export const useToggleCommentModeration = useModerateComment