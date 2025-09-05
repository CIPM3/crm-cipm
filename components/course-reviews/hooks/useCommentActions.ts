import { Course } from "@/types"

interface UseCommentActionsProps {
  courseId: string
  user: any
  createComment: any
  updateComment: any
  deleteComment: any
  toggleLike: any
  togglePin: any
  refetchComments: () => void
  setNewComment: (comment: string) => void
  setReplyingTo: (id: string | null) => void
  setEditingComment: (id: string | null) => void
  setEditCommentContent: (content: string) => void
  setEditDialogOpen: (open: boolean) => void
  setCommentToDelete: (id: string | null) => void
  setShowDeleteDialog: (show: boolean) => void
}

export function useCommentActions({
  courseId,
  user,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
  togglePin,
  refetchComments,
  setNewComment,
  setReplyingTo,
  setEditingComment,
  setEditCommentContent,
  setEditDialogOpen,
  setCommentToDelete,
  setShowDeleteDialog
}: UseCommentActionsProps) {

  const handleCreateComment = async (newComment: string, replyingTo: string | null) => {
    if (!user || !newComment.trim()) return

    try {
      const commentData = {
        courseId: courseId,
        content: newComment.trim(),
        parentId: replyingTo || null,
        userId: user.id,
        userName: user.name || user.email || 'Usuario',
        userRole: user.role || 'cliente',
        userAvatar: user.avatar || undefined
      }
      
      await createComment(commentData)
      
      // Force refresh comments immediately
      refetchComments()
      
      setNewComment("")
      setReplyingTo(null)
    } catch (error: any) {
      console.error('Error creating comment:', error)
      alert(`Error al crear comentario: ${error.message || 'Error desconocido'}`)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) return

    try {
      await toggleLike({ 
        commentId, 
        userId: user.id,
        courseId: courseId 
      })
      // Don't force refetch for likes to maintain smooth UX
      // TanStack Query's optimistic updates should handle this
    } catch (error) {
      console.error('Error liking comment:', error)
      // Refresh on error to ensure state consistency
      await refetchComments()
    }
  }

  const handleReplyToComment = (commentId: string) => {
    setReplyingTo(commentId)
    // Scroll to comment form
    const form = document.querySelector('[data-comment-form]')
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleEditComment = (commentId: string, content: string) => {
    setEditingComment(commentId)
    setEditCommentContent(content)
    setEditDialogOpen(true)
  }

  const handleUpdateComment = async (editingComment: string | null, editCommentContent: string) => {
    if (!editingComment || !editCommentContent.trim()) return

    try {
      await updateComment({
        commentId: editingComment,
        content: editCommentContent.trim(),
        courseId: courseId
      })
      
      // Force refresh to ensure consistency
      refetchComments()
      
      setEditDialogOpen(false)
      setEditingComment(null)
      setEditCommentContent("")
    } catch (error: any) {
      console.error('Error updating comment:', error)
      alert(`Error al actualizar comentario: ${error.message || 'Error desconocido'}`)
    }
  }

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async (commentToDelete: string | null) => {
    if (!commentToDelete) return

    try {
      await deleteComment({ 
        commentId: commentToDelete,
        courseId: courseId 
      })
      
      // Force refresh after deletion
      refetchComments()
      
      setShowDeleteDialog(false)
      setCommentToDelete(null)
    } catch (error: any) {
      console.error('Error deleting comment:', error)
      alert(`Error al eliminar comentario: ${error.message || 'Error desconocido'}`)
      setShowDeleteDialog(false)
      setCommentToDelete(null)
    }
  }

  const handlePinComment = async (commentId: string, isPinned: boolean) => {
    try {
      await togglePin({ 
        commentId, 
        isPinned: !isPinned,
        courseId: courseId 
      })
      // Force refresh for pin operations to ensure proper sorting
      await refetchComments()
    } catch (error) {
      console.error('Error pinning comment:', error)
      // Refresh on error to ensure state consistency
      await refetchComments()
    }
  }

  const handleCancelEdit = (allComments: any[], editingComment: string | null, editCommentContent: string) => {
    const originalContent = allComments.find(c => c.id === editingComment)?.content || ""
    if (editCommentContent !== originalContent) {
      if (window.confirm('¿Descartar los cambios realizados?')) {
        resetEditState()
      }
    } else {
      resetEditState()
    }
  }
  
  const resetEditState = () => {
    setEditDialogOpen(false)
    setEditingComment(null)
    setEditCommentContent("")
  }

  return {
    handleCreateComment,
    handleLikeComment,
    handleReplyToComment,
    handleEditComment,
    handleUpdateComment,
    handleDeleteComment,
    handleConfirmDelete,
    handlePinComment,
    handleCancelEdit,
    resetEditState
  }
}