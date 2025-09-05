// === COMMENTS LIST COMPONENT ===
// Manages display of comments with pagination and replies

import React from "react"
import { CourseComment } from "@/types"
import { CommentItem } from "./CommentItem"
import { CommentForm } from "./CommentForm"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommentsListProps {
  // Data
  comments: CourseComment[]
  replies: Record<string, CourseComment[]>
  
  // User permissions
  userRole?: string
  userId?: string
  canModerate?: boolean
  
  // States
  loading?: boolean
  showAllComments?: boolean
  replyingTo?: string | null
  editingComment?: string | null
  editContent?: string
  isSubmitting?: boolean
  
  // Limits
  maxInitialComments?: number
  allowReplies?: boolean
  
  // Actions
  onShowMore?: () => void
  onLike?: (commentId: string) => void
  onReply?: (commentId: string) => void
  onEdit?: (comment: CourseComment) => void
  onDelete?: (commentId: string) => void
  onPin?: (commentId: string, isPinned: boolean) => void
  onModerate?: (commentId: string, isModerated: boolean) => void
  onSubmitReply?: () => void
  onCancelReply?: () => void
  onSubmitEdit?: () => void
  onCancelEdit?: () => void
  onReplyContentChange?: (content: string) => void
  onEditContentChange?: (content: string) => void
  
  // Content
  replyContent?: string
  
  // Styling
  className?: string
  emptyMessage?: string
}

export const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  replies,
  userRole,
  userId,
  canModerate = false,
  loading = false,
  showAllComments = false,
  replyingTo,
  editingComment,
  editContent = "",
  isSubmitting = false,
  maxInitialComments = 10,
  allowReplies = true,
  onShowMore,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onPin,
  onModerate,
  onSubmitReply,
  onCancelReply,
  onSubmitEdit,
  onCancelEdit,
  onReplyContentChange,
  onEditContentChange,
  replyContent = "",
  className,
  emptyMessage = "No hay comentarios aún. ¡Sé el primero en comentar!"
}) => {
  // Permission checks
  const canEditComment = (comment: CourseComment) => 
    comment.userId === userId || canModerate
    
  const canDeleteComment = (comment: CourseComment) => 
    comment.userId === userId || canModerate
    
  const isCommentLiked = (comment: CourseComment) => 
    comment.likedBy?.includes(userId || '') || false

  // Display comments (limited or all)
  const displayedComments = showAllComments 
    ? comments 
    : comments.slice(0, maxInitialComments)

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {displayedComments.map((comment) => (
        <div key={comment.id}>
          {/* Main Comment */}
          {editingComment === comment.id ? (
            <CommentForm
              value={editContent}
              onChange={onEditContentChange || (() => {})}
              onSubmit={onSubmitEdit || (() => {})}
              onCancel={onCancelEdit}
              isSubmitting={isSubmitting}
              isEdit
              placeholder="Edita tu comentario..."
            />
          ) : (
            <CommentItem
              comment={comment}
              canLike={!!userId}
              canReply={allowReplies && !!userId}
              canEdit={canEditComment(comment)}
              canDelete={canDeleteComment(comment)}
              canPin={canModerate}
              canModerate={canModerate}
              isLiked={isCommentLiked(comment)}
              onLike={() => onLike?.(comment.id)}
              onReply={() => onReply?.(comment.id)}
              onEdit={() => onEdit?.(comment)}
              onDelete={() => onDelete?.(comment.id)}
              onPin={() => onPin?.(comment.id, !comment.isPinned)}
              onModerate={() => onModerate?.(comment.id, !comment.isModerated)}
            />
          )}
          
          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="ml-8 mt-2">
              <CommentForm
                value={replyContent}
                onChange={onReplyContentChange || (() => {})}
                onSubmit={onSubmitReply || (() => {})}
                onCancel={onCancelReply}
                isSubmitting={isSubmitting}
                isReply
                placeholder="Escribe tu respuesta..."
              />
            </div>
          )}
          
          {/* Replies */}
          {replies[comment.id]?.map((reply) => (
            <div key={reply.id} className="ml-8 mt-2">
              {editingComment === reply.id ? (
                <CommentForm
                  value={editContent}
                  onChange={onEditContentChange || (() => {})}
                  onSubmit={onSubmitEdit || (() => {})}
                  onCancel={onCancelEdit}
                  isSubmitting={isSubmitting}
                  isEdit
                  placeholder="Edita tu respuesta..."
                  compact
                />
              ) : (
                <CommentItem
                  comment={reply}
                  canLike={!!userId}
                  canReply={false} // No nested replies for now
                  canEdit={canEditComment(reply)}
                  canDelete={canDeleteComment(reply)}
                  canPin={canModerate}
                  canModerate={canModerate}
                  isLiked={isCommentLiked(reply)}
                  isReply
                  onLike={() => onLike?.(reply.id)}
                  onEdit={() => onEdit?.(reply)}
                  onDelete={() => onDelete?.(reply.id)}
                  onPin={() => onPin?.(reply.id, !reply.isPinned)}
                  onModerate={() => onModerate?.(reply.id, !reply.isModerated)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      
      {/* Show More Button */}
      {!showAllComments && comments.length > maxInitialComments && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onShowMore}
            className="min-w-32"
          >
            Ver más comentarios ({comments.length - maxInitialComments})
          </Button>
        </div>
      )}
    </div>
  )
}