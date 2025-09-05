// === COMMENTS STATE MANAGEMENT HOOK ===
// Centralizes all comment-related state management

import { useState, useCallback } from "react"
import { CourseComment } from "@/types"

interface CommentsState {
  // Form states
  newComment: string
  setNewComment: (content: string) => void
  
  // Interaction states
  replyingTo: string | null
  setReplyingTo: (commentId: string | null) => void
  
  // Editing states
  editingComment: string | null
  setEditingComment: (commentId: string | null) => void
  editContent: string
  setEditContent: (content: string) => void
  
  // UI states
  showAllComments: boolean
  setShowAllComments: (show: boolean) => void
  
  // Modal/Dialog states
  showDeleteDialog: boolean
  setShowDeleteDialog: (show: boolean) => void
  commentToDelete: string | null
  setCommentToDelete: (commentId: string | null) => void
  
  // Loading states
  isSubmitting: boolean
  setIsSubmitting: (loading: boolean) => void
  
  // Utility functions
  resetFormState: () => void
  startReply: (commentId: string) => void
  startEdit: (comment: CourseComment) => void
  cancelEdit: () => void
  cancelReply: () => void
}

export const useCommentsState = (): CommentsState => {
  // Form state
  const [newComment, setNewComment] = useState("")
  
  // Interaction states
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  
  // UI states
  const [showAllComments, setShowAllComments] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Utility functions
  const resetFormState = useCallback(() => {
    setNewComment("")
    setEditContent("")
    setIsSubmitting(false)
  }, [])
  
  const startReply = useCallback((commentId: string) => {
    setReplyingTo(commentId)
    setEditingComment(null)
  }, [])
  
  const startEdit = useCallback((comment: CourseComment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
    setReplyingTo(null)
  }, [])
  
  const cancelEdit = useCallback(() => {
    setEditingComment(null)
    setEditContent("")
  }, [])
  
  const cancelReply = useCallback(() => {
    setReplyingTo(null)
  }, [])
  
  return {
    // Form states
    newComment,
    setNewComment,
    
    // Interaction states
    replyingTo,
    setReplyingTo,
    
    // Editing states
    editingComment,
    setEditingComment,
    editContent,
    setEditContent,
    
    // UI states
    showAllComments,
    setShowAllComments,
    
    // Modal states
    showDeleteDialog,
    setShowDeleteDialog,
    commentToDelete,
    setCommentToDelete,
    
    // Loading states
    isSubmitting,
    setIsSubmitting,
    
    // Utility functions
    resetFormState,
    startReply,
    startEdit,
    cancelEdit,
    cancelReply,
  }
}