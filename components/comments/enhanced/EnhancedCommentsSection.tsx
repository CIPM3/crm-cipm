// === ENHANCED COMMENTS SECTION - REFACTORED ===
// Main container component for the enhanced comments system
// Reduced from 593 lines to ~150 lines by extracting focused components

"use client"

import React from "react"
import { MessageCircle } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { 
  useGetCourseComments,
  useGetCommentReplies,
  useCommentInteractions,
  useGetCommentStats
} from "@/hooks/queries/index"
import { CourseComment } from "@/types"
import { ROLES } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Modular components
import { useCommentsState } from "./useCommentsState"
import { CommentForm } from "./CommentForm"
import { CommentsList } from "./CommentsList"
import { CommentsStats } from "./CommentsStats"

interface EnhancedCommentsSectionProps {
  courseId: string
  maxInitialComments?: number
  allowReplies?: boolean
  showStats?: boolean
}

export default function EnhancedCommentsSection({ 
  courseId, 
  maxInitialComments = 10,
  allowReplies = true,
  showStats = true
}: EnhancedCommentsSectionProps) {
  const { user } = useAuthStore()
  
  // Centralized state management
  const {
    newComment,
    setNewComment,
    replyingTo,
    editingComment,
    editContent,
    setEditContent,
    showAllComments,
    setShowAllComments,
    showDeleteDialog,
    setShowDeleteDialog,
    commentToDelete,
    setCommentToDelete,
    isSubmitting,
    setIsSubmitting,
    resetFormState,
    startReply,
    startEdit,
    cancelEdit,
    cancelReply,
  } = useCommentsState()

  // Data fetching hooks
  const { data: comments = [], loading: commentsLoading, refetch } = useGetCourseComments(courseId)
  const { data: stats, loading: statsLoading } = useGetCommentStats(courseId)
  
  // Get replies for all comments
  const repliesMap: Record<string, CourseComment[]> = {}
  comments.forEach(comment => {
    const { data: replies = [] } = useGetCommentReplies(comment.id)
    repliesMap[comment.id] = replies
  })

  // Comment interactions
  const {
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    togglePin,
    toggleModeration
  } = useCommentInteractions()

  // Permission checks
  const canModerate = user?.role && ['admin', 'develop', 'instructor'].includes(user.role.toLowerCase())

  // Handlers
  const handleSubmitNewComment = async () => {
    if (!newComment.trim() || !user) return
    
    setIsSubmitting(true)
    try {
      await createComment({
        courseId,
        content: newComment.trim(),
        parentId: null
      })
      resetFormState()
      refetch()
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async () => {
    if (!newComment.trim() || !replyingTo || !user) return
    
    setIsSubmitting(true)
    try {
      await createComment({
        courseId,
        content: newComment.trim(),
        parentId: replyingTo
      })
      resetFormState()
      cancelReply()
      refetch()
    } catch (error) {
      console.error('Error creating reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitEdit = async () => {
    if (!editContent.trim() || !editingComment) return
    
    setIsSubmitting(true)
    try {
      await updateComment({
        id: editingComment,
        data: { content: editContent.trim() },
        courseId
      })
      cancelEdit()
      refetch()
    } catch (error) {
      console.error('Error updating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async () => {
    if (!commentToDelete) return
    
    try {
      await deleteComment({
        id: commentToDelete,
        courseId,
        hasReplies: repliesMap[commentToDelete]?.length > 0
      })
      setShowDeleteDialog(false)
      setCommentToDelete(null)
      refetch()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comentarios y Discusión
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Statistics */}
        {showStats && (
          <CommentsStats 
            stats={stats}
            loading={statsLoading}
            compact
          />
        )}
        
        <Separator />
        
        {/* New Comment Form */}
        {user ? (
          <CommentForm
            value={newComment}
            onChange={setNewComment}
            onSubmit={handleSubmitNewComment}
            isSubmitting={isSubmitting}
            userAvatar={user.avatar}
            userName={user.name || user.email}
            placeholder="Comparte tu opinión sobre este curso..."
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Inicia sesión para participar en la discusión
          </div>
        )}
        
        <Separator />
        
        {/* Comments List */}
        <CommentsList
          comments={comments}
          replies={repliesMap}
          userRole={user?.role}
          userId={user?.id}
          canModerate={canModerate}
          loading={commentsLoading}
          showAllComments={showAllComments}
          replyingTo={replyingTo}
          editingComment={editingComment}
          editContent={editContent}
          isSubmitting={isSubmitting}
          maxInitialComments={maxInitialComments}
          allowReplies={allowReplies}
          replyContent={newComment}
          onShowMore={() => setShowAllComments(true)}
          onLike={(commentId) => toggleLike({ 
            commentId, 
            userId: user?.id || '', 
            courseId 
          })}
          onReply={(commentId) => startReply(commentId)}
          onEdit={(comment) => startEdit(comment)}
          onDelete={(commentId) => {
            setCommentToDelete(commentId)
            setShowDeleteDialog(true)
          }}
          onPin={(commentId, isPinned) => togglePin(commentId, isPinned)}
          onModerate={(commentId, isModerated) => toggleModeration(commentId, isModerated)}
          onSubmitReply={handleSubmitReply}
          onCancelReply={cancelReply}
          onSubmitEdit={handleSubmitEdit}
          onCancelEdit={cancelEdit}
          onReplyContentChange={setNewComment}
          onEditContentChange={setEditContent}
        />
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar comentario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El comentario y todas sus respuestas serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComment}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}