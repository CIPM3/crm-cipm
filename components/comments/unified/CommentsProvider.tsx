"use client"

import { createContext, useContext, ReactNode } from 'react'
import { CourseComment, CommentFormValues } from '@/types'

export interface CommentsContextType {
  // Data
  comments: CourseComment[]
  isLoading: boolean
  error: Error | null
  stats?: {
    total: number
    approved: number
    pending: number
    pinned: number
  }
  
  // Configuration
  config: {
    contextType: 'course' | 'video' | 'standalone-video'
    contextId: string // courseId or videoId
    contentId?: string // for video comments within a course
    maxInitialComments: number
    allowReplies: boolean
    showStats: boolean
    enableModeration: boolean
  }
  
  // Actions
  actions: {
    createComment: (data: Omit<CommentFormValues, 'courseId'>) => Promise<void>
    updateComment: (id: string, data: Partial<CommentFormValues>) => Promise<void>
    deleteComment: (id: string) => Promise<void>
    toggleLike: (id: string) => Promise<void>
    togglePin?: (id: string) => Promise<void>
    toggleModeration?: (id: string) => Promise<void>
  }
  
  // UI State
  ui: {
    showAllComments: boolean
    setShowAllComments: (show: boolean) => void
    replyingTo: string | null
    setReplyingTo: (id: string | null) => void
    editingComment: string | null
    setEditingComment: (id: string | null) => void
  }
  
  // Permissions
  permissions: {
    canComment: boolean
    canModerate: boolean
    canPin: boolean
    canDelete: (comment: CourseComment) => boolean
    canEdit: (comment: CourseComment) => boolean
  }
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined)

export const useComments = () => {
  const context = useContext(CommentsContext)
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider')
  }
  return context
}

export interface CommentsProviderProps {
  children: ReactNode
  contextType: 'course' | 'video' | 'standalone-video'
  contextId: string
  contentId?: string
  maxInitialComments?: number
  allowReplies?: boolean
  showStats?: boolean
  enableModeration?: boolean
}

export { CommentsContext }