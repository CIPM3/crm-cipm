// hooks/comments/index.tsx - Standardized Course Comments Hooks

import { useEffect, useState } from "react"
import { 
  CourseComment, 
  CreateCommentData, 
  UpdateCommentData, 
  CommentsQueryOptions,
  CommentWithReplies
} from "@/types"
import {
  getAllCommentsForCourse,
  getTopLevelCommentsForCourse,
  getRepliesForComment,
  getCommentsByUser,
  getPinnedCommentsForCourse,
  queryComments,
  getCommentsWithReplies,
  getCommentStats,
  createCourseComment,
  updateCourseComment,
  deleteCourseComment,
  toggleCommentLike,
  toggleCommentPin,
  toggleCommentModeration,
  bulkModerateComments,
  bulkDeleteComments
} from "@/api/Comments"
import { 
  useStandardizedMutation, 
  useStandardizedQuery,
  StandardMutationReturn,
  StandardQueryReturn
} from "../core/useStandardizedHook"

// === MUTATION HOOKS (Write Operations) ===

export const useCreateComment = (): StandardMutationReturn<
  { id: string }, 
  CreateCommentData & {
    userId: string;
    userName: string;
    userRole: string;
    userAvatar?: string;
  }
> => {
  return useStandardizedMutation(async (commentData) => {
    const { userId, userName, userRole, userAvatar, ...createData } = commentData
    return await createCourseComment(createData, userId, userName, userRole, userAvatar)
  })
}

export const useUpdateComment = (): StandardMutationReturn<
  { id: string }, 
  { id: string; data: UpdateCommentData }
> => {
  return useStandardizedMutation(async ({ id, data }) => {
    return await updateCourseComment(id, data)
  })
}

export const useDeleteComment = (): StandardMutationReturn<{ id: string }, string> => {
  return useStandardizedMutation(async (id: string) => {
    return await deleteCourseComment(id)
  })
}

export const useLikeComment = (): StandardMutationReturn<
  { id: string }, 
  { commentId: string; userId: string }
> => {
  return useStandardizedMutation(async ({ commentId, userId }) => {
    return await toggleCommentLike(commentId, userId)
  })
}

export const usePinComment = (): StandardMutationReturn<
  { id: string }, 
  { commentId: string; isPinned: boolean }
> => {
  return useStandardizedMutation(async ({ commentId, isPinned }) => {
    return await toggleCommentPin(commentId, isPinned)
  })
}

export const useModerateComment = (): StandardMutationReturn<
  { id: string }, 
  { commentId: string; isModerated: boolean }
> => {
  return useStandardizedMutation(async ({ commentId, isModerated }) => {
    return await toggleCommentModeration(commentId, isModerated)
  })
}

// === QUERY HOOKS (Read Operations) ===

export const useFetchCourseComments = (courseId: string): StandardQueryReturn<CourseComment[]> & { 
  comments: CourseComment[] 
} => {
  const queryResult = useStandardizedQuery<CourseComment[]>(
    () => getAllCommentsForCourse(courseId),
    [courseId]
  )
  
  // Auto-fetch when courseId changes
  useEffect(() => {
    if (courseId) {
      queryResult.refetch()
    }
  }, [courseId, queryResult.refetch])

  return {
    ...queryResult,
    comments: queryResult.data || []
  }
}

export const useFetchTopLevelComments = (
  courseId: string, 
  limit?: number
): StandardQueryReturn<CourseComment[]> & { comments: CourseComment[] } => {
  const queryResult = useStandardizedQuery<CourseComment[]>(
    () => getTopLevelCommentsForCourse(courseId, limit),
    [courseId, limit]
  )
  
  useEffect(() => {
    if (courseId) {
      queryResult.refetch()
    }
  }, [courseId, limit, queryResult.refetch])

  return {
    ...queryResult,
    comments: queryResult.data || []
  }
}

export const useFetchCommentReplies = (
  parentId: string,
  limit?: number
): StandardQueryReturn<CourseComment[]> & { replies: CourseComment[] } => {
  const queryResult = useStandardizedQuery<CourseComment[]>(
    () => getRepliesForComment(parentId, limit),
    [parentId, limit]
  )
  
  useEffect(() => {
    if (parentId) {
      queryResult.refetch()
    }
  }, [parentId, limit, queryResult.refetch])

  return {
    ...queryResult,
    replies: queryResult.data || []
  }
}

export const useFetchUserComments = (
  userId: string,
  courseId?: string
): StandardQueryReturn<CourseComment[]> & { comments: CourseComment[] } => {
  const queryResult = useStandardizedQuery<CourseComment[]>(
    () => getCommentsByUser(userId, courseId),
    [userId, courseId]
  )
  
  useEffect(() => {
    if (userId) {
      queryResult.refetch()
    }
  }, [userId, courseId, queryResult.refetch])

  return {
    ...queryResult,
    comments: queryResult.data || []
  }
}

export const useFetchPinnedComments = (
  courseId: string
): StandardQueryReturn<CourseComment[]> & { pinnedComments: CourseComment[] } => {
  const queryResult = useStandardizedQuery<CourseComment[]>(
    () => getPinnedCommentsForCourse(courseId),
    [courseId]
  )
  
  useEffect(() => {
    if (courseId) {
      queryResult.refetch()
    }
  }, [courseId, queryResult.refetch])

  return {
    ...queryResult,
    pinnedComments: queryResult.data || []
  }
}

export const useFetchCommentsWithOptions = (
  options: CommentsQueryOptions
): StandardQueryReturn<CourseComment[]> & { comments: CourseComment[] } => {
  const queryResult = useStandardizedQuery<CourseComment[]>(
    () => queryComments(options),
    [options]
  )
  
  useEffect(() => {
    queryResult.refetch()
  }, [options, queryResult.refetch])

  return {
    ...queryResult,
    comments: queryResult.data || []
  }
}

// === ADVANCED HOOKS ===

export const useFetchCommentsWithReplies = (
  courseId: string
): StandardQueryReturn<CommentWithReplies[]> & {
  commentsWithReplies: CommentWithReplies[];
} => {
  const queryResult = useStandardizedQuery<CommentWithReplies[]>(
    () => getCommentsWithReplies(courseId),
    [courseId]
  )
  
  useEffect(() => {
    if (courseId) {
      queryResult.refetch()
    }
  }, [courseId, queryResult.refetch])

  return {
    ...queryResult,
    commentsWithReplies: queryResult.data || []
  }
}

export const useFetchCommentStats = (
  courseId: string
): StandardQueryReturn<{
  totalComments: number;
  totalReplies: number;
  totalInteractions: number;
  totalLikes: number;
  pinnedComments: number;
  moderatedComments: number;
  averageLikesPerComment: number;
}> & {
  totalComments: number;
  totalReplies: number;
  totalInteractions: number;
  totalLikes: number;
  pinnedComments: number;
  moderatedComments: number;
  averageLikesPerComment: number;
} => {
  const queryResult = useStandardizedQuery<{
    totalComments: number;
    totalReplies: number;
    totalInteractions: number;
    totalLikes: number;
    pinnedComments: number;
    moderatedComments: number;
    averageLikesPerComment: number;
  }>(
    () => getCommentStats(courseId),
    [courseId]
  )
  
  useEffect(() => {
    if (courseId) {
      queryResult.refetch()
    }
  }, [courseId, queryResult.refetch])

  return {
    ...queryResult,
    totalComments: queryResult.data?.totalComments || 0,
    totalReplies: queryResult.data?.totalReplies || 0,
    totalInteractions: queryResult.data?.totalInteractions || 0,
    totalLikes: queryResult.data?.totalLikes || 0,
    pinnedComments: queryResult.data?.pinnedComments || 0,
    moderatedComments: queryResult.data?.moderatedComments || 0,
    averageLikesPerComment: queryResult.data?.averageLikesPerComment || 0
  }
}

// === BATCH OPERATIONS HOOKS ===

export const useBulkModerateComments = (): StandardMutationReturn<
  void, 
  { commentIds: string[]; isModerated: boolean }
> => {
  return useStandardizedMutation(async ({ commentIds, isModerated }) => {
    return await bulkModerateComments(commentIds, isModerated)
  })
}

export const useBulkDeleteComments = (): StandardMutationReturn<void, string[]> => {
  return useStandardizedMutation(async (commentIds: string[]) => {
    return await bulkDeleteComments(commentIds)
  })
}

// === COMPOSITE HOOKS FOR COMMON WORKFLOWS ===

export const useCommentInteractions = () => {
  const createMutation = useCreateComment()
  const updateMutation = useUpdateComment()
  const deleteMutation = useDeleteComment()
  const likeMutation = useLikeComment()
  const pinMutation = usePinComment()
  const moderateMutation = useModerateComment()

  return {
    // Comment CRUD
    createComment: createMutation.mutate,
    updateComment: updateMutation.mutate,
    deleteComment: deleteMutation.mutate,
    
    // Comment interactions
    toggleLike: likeMutation.mutate,
    togglePin: pinMutation.mutate,
    toggleModeration: moderateMutation.mutate,
    
    // Loading states
    isCreating: createMutation.loading,
    isUpdating: updateMutation.loading,
    isDeleting: deleteMutation.loading,
    isLiking: likeMutation.loading,
    isPinning: pinMutation.loading,
    isModerating: moderateMutation.loading,
    
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

// === REAL-TIME COMMENT MANAGEMENT ===

export const useCommentManager = (courseId: string) => {
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  
  const interactions = useCommentInteractions()
  const { comments, refetch } = useFetchTopLevelComments(courseId)
  const stats = useFetchCommentStats(courseId)
  
  const selectComment = (commentId: string) => {
    setSelectedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }
  
  const selectAllComments = () => {
    setSelectedComments(comments.map(c => c.id))
  }
  
  const clearSelection = () => {
    setSelectedComments([])
  }
  
  const startReply = (commentId: string) => {
    setReplyingTo(commentId)
  }
  
  const cancelReply = () => {
    setReplyingTo(null)
  }
  
  const startEdit = (commentId: string) => {
    setEditingComment(commentId)
  }
  
  const cancelEdit = () => {
    setEditingComment(null)
  }
  
  const refreshComments = async () => {
    await refetch()
    await stats.refetch()
  }
  
  return {
    // Data
    comments,
    stats,
    
    // Selection state
    selectedComments,
    selectComment,
    selectAllComments,
    clearSelection,
    
    // Interaction state
    replyingTo,
    startReply,
    cancelReply,
    editingComment,
    startEdit,
    cancelEdit,
    
    // Actions
    ...interactions,
    refreshComments,
    
    // Loading states
    isLoadingComments: comments.length === 0 && !refetch,
    isRefreshing: false // You can implement this based on refetch state
  }
}

// === LEGACY COMPATIBILITY EXPORTS ===

export const useCreateCommentV1 = () => {
  const mutation = useCreateComment()
  return {
    mutate: mutation.mutate,
    data: mutation.data,
    loading: mutation.loading,
    error: mutation.error
  }
}

export const useFetchCourseCommentsV1 = (courseId: string) => {
  const query = useFetchCourseComments(courseId)
  return {
    comments: query.comments,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch
  }
}