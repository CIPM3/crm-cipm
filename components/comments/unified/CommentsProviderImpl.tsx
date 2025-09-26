"use client"

import { useState, useMemo } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { ROLES } from '@/lib/constants'
import { CourseComment, CommentFormValues } from '@/types'
import { 
  useGetCourseComments,
  useGetVideoComments,
  useGetStandaloneVideoComments,
  useGetCommentStats
} from '@/hooks/comments/queries'
import { useCommentInteractions } from '@/hooks/comments/interactions'
import { 
  CommentsContext, 
  CommentsContextType, 
  CommentsProviderProps 
} from './CommentsProvider'

export default function CommentsProviderImpl({
  children,
  contextType,
  contextId,
  contentId,
  maxInitialComments = 10,
  allowReplies = true,
  showStats = true,
  enableModeration = true
}: CommentsProviderProps) {
  const { user } = useAuthStore()
  
  // UI State
  const [showAllComments, setShowAllComments] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)

  // Data fetching based on context type
  const courseEnabled = contextType === 'course' && !!contextId
  const videoEnabled = contextType === 'video' && !!contextId && !!contentId
  const standaloneEnabled = contextType === 'standalone-video' && !!contextId

  const {
    data: courseComments = [],
    isLoading: courseLoading,
    error: courseError
  } = useGetCourseComments(
    courseEnabled ? contextId : '',
    courseEnabled ? { 
      topLevelOnly: true,
      limit: showAllComments ? undefined : maxInitialComments
    } : undefined
  )

  const {
    data: videoComments = [],
    isLoading: videoLoading,
    error: videoError
  } = useGetVideoComments(
    videoEnabled ? contextId : '',
    videoEnabled ? contentId! : '',
    videoEnabled ? {
      limit: showAllComments ? undefined : maxInitialComments
    } : undefined
  )

  const {
    data: standaloneVideoComments = [],
    isLoading: standaloneLoading,
    error: standaloneError
  } = useGetStandaloneVideoComments(
    standaloneEnabled ? contextId : '',
    standaloneEnabled ? {
      limit: showAllComments ? undefined : maxInitialComments
    } : undefined
  )

  // Stats (only for course and video contexts)
  const { data: stats } = useGetCommentStats(
    showStats && (contextType === 'course' || contextType === 'video') ? contextId : ''
  )

  // Comment interactions
  const commentInteractions = useCommentInteractions()

  // Determine which data to use
  const { comments, isLoading, error } = useMemo(() => {
    switch (contextType) {
      case 'course':
        return { 
          comments: courseComments, 
          isLoading: courseLoading, 
          error: courseError 
        }
      case 'video':
        return { 
          comments: videoComments, 
          isLoading: videoLoading, 
          error: videoError 
        }
      case 'standalone-video':
        return { 
          comments: standaloneVideoComments, 
          isLoading: standaloneLoading, 
          error: standaloneError 
        }
      default:
        return { comments: [], isLoading: false, error: null }
    }
  }, [
    contextType,
    courseComments, courseLoading, courseError,
    videoComments, videoLoading, videoError,
    standaloneVideoComments, standaloneLoading, standaloneError
  ])

  // Permissions
  const permissions = useMemo(() => {
    const isAuthenticated = !!user
    const isAdmin = user?.role === ROLES.ADMIN
    const isInstructor = user?.role === ROLES.INSTRUCTOR
    const canModerate = isAdmin || isInstructor

    return {
      canComment: isAuthenticated,
      canModerate: canModerate && enableModeration,
      canPin: canModerate && enableModeration,
      canDelete: (comment: CourseComment) => {
        if (!isAuthenticated) return false
        if (isAdmin) return true
        if (isInstructor) return true
        return comment.authorId === user.id
      },
      canEdit: (comment: CourseComment) => {
        if (!isAuthenticated) return false
        if (isAdmin) return true
        return comment.authorId === user.id
      }
    }
  }, [user, enableModeration])

  // Actions
  const actions = useMemo(() => ({
    createComment: async (data: Omit<CommentFormValues, 'courseId'>) => {
      const commentData = {
        ...data,
        courseId: contextType === 'course' ? contextId : '',
        contentId: contextType !== 'course' ? contextId : contentId,
        commentType: contextType === 'course' ? 'course' : 'video'
      }
      await commentInteractions.createComment(commentData)
    },
    
    updateComment: commentInteractions.updateComment,
    deleteComment: commentInteractions.deleteComment,
    toggleLike: commentInteractions.toggleLike,
    
    ...(permissions.canPin && {
      togglePin: commentInteractions.togglePin
    }),
    
    ...(permissions.canModerate && {
      toggleModeration: commentInteractions.toggleModeration
    })
  }), [
    contextType, 
    contextId, 
    contentId, 
    commentInteractions, 
    permissions.canPin, 
    permissions.canModerate
  ])

  // Context value
  const contextValue: CommentsContextType = {
    comments,
    isLoading,
    error,
    stats,
    config: {
      contextType,
      contextId,
      contentId,
      maxInitialComments,
      allowReplies,
      showStats,
      enableModeration
    },
    actions,
    ui: {
      showAllComments,
      setShowAllComments,
      replyingTo,
      setReplyingTo,
      editingComment,
      setEditingComment
    },
    permissions
  }

  return (
    <CommentsContext.Provider value={contextValue}>
      {children}
    </CommentsContext.Provider>
  )
}