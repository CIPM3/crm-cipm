// === REFACTORED COMMENT HOOKS ===
// This file exports all comment-related hooks from their focused modules

// Query hooks (read operations)
export {
  useCommentsObserver,
  useGetCourseComments,
  useGetTopLevelComments,
  useGetCommentReplies,
  useGetPinnedComments,
  useGetUserComments,
  useGetCommentStats,
  useQueryComments
} from './useCommentQueries'

// Mutation hooks (write operations)
export {
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useLikeComment,
  usePinComment,
  useModerateComment
} from './useCommentMutations'

// Interaction hooks (combined operations)
export {
  useCommentInteractions,
  useCommentCreation
} from './useCommentInteractions'

// Re-export for backward compatibility
export { useCommentInteractions as useCommentInteractionsLegacy } from './useCommentInteractions'