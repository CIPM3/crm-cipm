import { useCreateComment, useUpdateComment, useDeleteComment, useLikeComment, usePinComment, useModerateComment } from './useCommentMutations'

/**
 * Combined hook for all comment interactions
 * This provides a unified interface for all comment operations
 */
export const useCommentInteractions = () => {
  const createCommentMutation = useCreateComment()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const likeCommentMutation = useLikeComment()
  const pinCommentMutation = usePinComment()
  const moderateCommentMutation = useModerateComment()

  return {
    // Create operations
    createComment: createCommentMutation.mutate,
    createCommentAsync: createCommentMutation.mutateAsync,
    isCreating: createCommentMutation.isPending,
    createError: createCommentMutation.error,

    // Update operations
    updateComment: updateCommentMutation.mutate,
    updateCommentAsync: updateCommentMutation.mutateAsync,
    isUpdating: updateCommentMutation.isPending,
    updateError: updateCommentMutation.error,

    // Delete operations
    deleteComment: deleteCommentMutation.mutate,
    deleteCommentAsync: deleteCommentMutation.mutateAsync,
    isDeleting: deleteCommentMutation.isPending,
    deleteError: deleteCommentMutation.error,

    // Like operations
    toggleLike: likeCommentMutation.mutate,
    toggleLikeAsync: likeCommentMutation.mutateAsync,
    isTogglingLike: likeCommentMutation.isPending,
    likeError: likeCommentMutation.error,

    // Pin operations (moderator only)
    togglePin: pinCommentMutation.mutate,
    togglePinAsync: pinCommentMutation.mutateAsync,
    isTogglingPin: pinCommentMutation.isPending,
    pinError: pinCommentMutation.error,

    // Moderation operations (admin/instructor only)
    toggleModeration: moderateCommentMutation.mutate,
    toggleModerationAsync: moderateCommentMutation.mutateAsync,
    isTogglingModeration: moderateCommentMutation.isPending,
    moderationError: moderateCommentMutation.error,

    // Combined loading states
    isPerformingAction: (
      createCommentMutation.isPending ||
      updateCommentMutation.isPending ||
      deleteCommentMutation.isPending ||
      likeCommentMutation.isPending ||
      pinCommentMutation.isPending ||
      moderateCommentMutation.isPending
    ),

    // Combined error state
    hasError: !!(
      createCommentMutation.error ||
      updateCommentMutation.error ||
      deleteCommentMutation.error ||
      likeCommentMutation.error ||
      pinCommentMutation.error ||
      moderateCommentMutation.error
    ),

    // Error messages
    errorMessages: [
      createCommentMutation.error?.message,
      updateCommentMutation.error?.message,
      deleteCommentMutation.error?.message,
      likeCommentMutation.error?.message,
      pinCommentMutation.error?.message,
      moderateCommentMutation.error?.message
    ].filter(Boolean),

    // Reset functions
    resetCreateError: createCommentMutation.reset,
    resetUpdateError: updateCommentMutation.reset,
    resetDeleteError: deleteCommentMutation.reset,
    resetLikeError: likeCommentMutation.reset,
    resetPinError: pinCommentMutation.reset,
    resetModerationError: moderateCommentMutation.reset,

    // Reset all errors
    resetAllErrors: () => {
      createCommentMutation.reset()
      updateCommentMutation.reset()
      deleteCommentMutation.reset()
      likeCommentMutation.reset()
      pinCommentMutation.reset()
      moderateCommentMutation.reset()
    }
  }
}

/**
 * Focused hook for comment creation with validation
 */
export const useCommentCreation = () => {
  const { createComment, createCommentAsync, isCreating, createError, resetCreateError } = useCommentInteractions()

  const createCommentWithValidation = async (data: any) => {
    // Reset previous errors
    resetCreateError()

    // Basic validation
    if (!data.content?.trim()) {
      throw new Error('El contenido del comentario no puede estar vacío')
    }

    if (data.content.length > 2000) {
      throw new Error('El comentario no puede exceder 2000 caracteres')
    }

    // Check for spam-like content
    const spamPatterns = [
      /(.)\1{10,}/, // Repeated characters
      /^[A-Z\s!]{20,}$/, // All caps
      /(https?:\/\/[^\s]+)/g // URLs (basic check)
    ]

    const hasSpam = spamPatterns.some(pattern => pattern.test(data.content))
    if (hasSpam) {
      throw new Error('El contenido parece spam. Por favor, revisa tu comentario.')
    }

    return createCommentAsync(data)
  }

  return {
    createComment: createCommentWithValidation,
    isCreating,
    error: createError,
    resetError: resetCreateError
  }
}