import { 
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useToggleCommentLike,
  useToggleCommentPin,
  useToggleCommentModeration
} from './mutations'
import { CreateCommentData, UpdateCommentData } from '@/types'

export const useCommentInteractions = () => {
  const createMutation = useCreateComment()
  const updateMutation = useUpdateComment()
  const deleteMutation = useDeleteComment()
  const likeMutation = useToggleCommentLike()
  const pinMutation = useToggleCommentPin()
  const moderationMutation = useToggleCommentModeration()

  return {
    // Create comment
    createComment: async (data: CreateCommentData) => {
      return createMutation.mutateAsync(data)
    },
    isCreating: createMutation.isPending,

    // Update comment
    updateComment: async (id: string, data: UpdateCommentData, courseId?: string) => {
      return updateMutation.mutateAsync({ id, data, courseId: courseId || '' })
    },
    isUpdating: updateMutation.isPending,

    // Delete comment
    deleteComment: async (id: string, courseId?: string) => {
      return deleteMutation.mutateAsync({ id, courseId: courseId || '' })
    },
    isDeleting: deleteMutation.isPending,

    // Toggle like
    toggleLike: async (commentId: string, userId?: string, courseId?: string) => {
      if (!userId) throw new Error('User ID required for liking')
      return likeMutation.mutateAsync({ commentId, userId, courseId: courseId || '' })
    },
    isLiking: likeMutation.isPending,

    // Toggle pin (admin/instructor only)
    togglePin: async (commentId: string, isPinned?: boolean, courseId?: string) => {
      return pinMutation.mutateAsync({ 
        commentId, 
        isPinned: isPinned || false, 
        courseId: courseId || '' 
      })
    },
    isPinning: pinMutation.isPending,

    // Toggle moderation (admin/instructor only)
    toggleModeration: async (commentId: string, courseId?: string) => {
      return moderationMutation.mutateAsync({ commentId, courseId: courseId || '' })
    },
    isModerating: moderationMutation.isPending,

    // Overall loading state
    isLoading: (
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      likeMutation.isPending ||
      pinMutation.isPending ||
      moderationMutation.isPending
    )
  }
}