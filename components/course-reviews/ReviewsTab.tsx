"use client"
import { Course } from "@/types"
import { RatingOverview } from "./RatingOverview"
import { CommentForm } from "./CommentForm"
import { CommentsList } from "./CommentsList"
import { CommentsLoadingSkeleton, CommentsErrorState } from "./CommentStates"
import { useReviewsTab } from "./hooks/useReviewsTab"
import { useCommentActions } from "./hooks/useCommentActions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReviewsTabProps {
  course: Course
}

export default function ReviewsTab({ course }: ReviewsTabProps) {
  const {
    // State
    newComment,
    setNewComment,
    replyingTo,
    setReplyingTo,
    editingComment,
    setEditingComment,
    showDeleteDialog,
    setShowDeleteDialog,
    commentToDelete,
    setCommentToDelete,
    editDialogOpen,
    setEditDialogOpen,
    editCommentContent,
    setEditCommentContent,

    // Data
    commentsWithReplies,
    stats,
    ratingDistribution,
    allComments,

    // Loading states
    loadingComments,
    commentsError,
    isCreating,
    isDeleting,

    // Actions
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    togglePin,
    refetchComments,

    // Permissions
    canModerate,
    isAuthenticated,
    user
  } = useReviewsTab({ courseId: course.id })

  const {
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
  } = useCommentActions({
    courseId: course.id,
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
  })

  if (loadingComments) {
    return <CommentsLoadingSkeleton />
  }

  if (commentsError) {
    return <CommentsErrorState error={commentsError} />
  }

  const handleSubmitComment = () => handleCreateComment(newComment, replyingTo)
  const handleSubmitEdit = () => handleUpdateComment(editingComment, editCommentContent)
  const handleCancelEditWithCheck = () => handleCancelEdit(allComments, editingComment, editCommentContent)
  const handleConfirmDeleteAction = () => handleConfirmDelete(commentToDelete)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Rating Overview */}
      <RatingOverview 
        course={course}
        ratingDistribution={ratingDistribution}
        totalComments={stats?.totalComments || allComments.length}
      />
      
      {/* Comment Form */}
      <div data-comment-form>
        <CommentForm
          newComment={newComment}
          setNewComment={setNewComment}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          onSubmit={handleSubmitComment}
          isCreating={isCreating}
          isAuthenticated={isAuthenticated}
          user={user}
          allComments={allComments}
        />
      </div>
      
      {/* Comments List */}
      <CommentsList
        comments={commentsWithReplies}
        currentUserId={user?.id}
        canModerate={canModerate}
        onLike={handleLikeComment}
        onReply={handleReplyToComment}
        onEdit={handleEditComment}
        onDelete={handleDeleteComment}
        onPin={handlePinComment}
      />

      {/* Edit Comment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar comentario</DialogTitle>
            <DialogDescription>
              Realiza los cambios necesarios a tu comentario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={editCommentContent}
              onChange={(e) => setEditCommentContent(e.target.value)}
              className="min-h-[100px] resize-none"
              placeholder="Escribe tu comentario..."
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCancelEditWithCheck}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitEdit}
              disabled={!editCommentContent.trim() || isCreating}
            >
              {isCreating ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El comentario será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setShowDeleteDialog(false)
                setCommentToDelete(null)
              }}
              disabled={isDeleting}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteAction}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}