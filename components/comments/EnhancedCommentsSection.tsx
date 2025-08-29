// components/comments/EnhancedCommentsSection.tsx - Enhanced Comments System Integration
"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Pin, Flag, Heart, Reply, MoreVertical, Edit, Trash2 } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { 
  useGetCourseComments,
  useGetCommentReplies,
  useCommentInteractions,
  useGetCommentStats
} from "@/hooks/queries"
import { CourseComment, CommentFormValues } from "@/types"
import { ROLES, hasRouteAccess } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

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
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [showAllComments, setShowAllComments] = useState(false)

  // Fetch comments and stats
  const { 
    data: topLevelComments = [], 
    isLoading: commentsLoading, 
    refetch: refetchComments 
  } = useGetCourseComments(courseId, { 
    topLevelOnly: true, 
    limit: showAllComments ? undefined : maxInitialComments 
  })
  
  const {
    data: stats
  } = useGetCommentStats(courseId)

  // Comment interactions
  const {
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    togglePin,
    toggleModeration,
    isCreating,
    isDeleting
  } = useCommentInteractions()

  // Permission checks
  const canModerate = user?.role === ROLES.ADMIN || user?.role === ROLES.INSTRUCTOR
  const isAuthenticated = !!user

  const handleCreateComment = async (content: string, parentId?: string) => {
    if (!user || !content.trim()) return

    try {
      await createComment({
        courseId,
        content: content.trim(),
        parentId: parentId || null,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        userAvatar: user.avatar
      })
      
      // Clear form
      setNewComment("")
      setReplyingTo(null)
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (!content.trim()) return

    try {
      await updateComment({
        id: commentId,
        data: { content: content.trim() },
        courseId
      })
      setEditingComment(null)
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) return

    try {
      await deleteComment({ 
        id: commentId, 
        courseId,
        hasReplies: false // You might want to check this based on comment data
      })
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) return

    try {
      await toggleLike({ 
        commentId, 
        userId: user.id,
        courseId 
      })
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const handlePinComment = async (commentId: string, isPinned: boolean) => {
    try {
      await togglePin({ 
        commentId, 
        isPinned: !isPinned,
        courseId 
      })
    } catch (error) {
      console.error('Error pinning comment:', error)
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-xl font-semibold">
              Comentarios {showStats && `(${stats?.totalComments || 0})`}
            </h3>
            {showStats && (stats?.totalReplies || 0) > 0 && (
              <p className="text-sm text-muted-foreground">
                {stats?.totalReplies || 0} respuestas • {stats?.totalLikes || 0} me gusta
              </p>
            )}
          </div>
        </div>
        
        {!showAllComments && topLevelComments.length >= maxInitialComments && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAllComments(true)}
          >
            Ver todos los comentarios
          </Button>
        )}
      </div>

      {/* New Comment Form */}
      {isAuthenticated && (
        <CommentForm
          value={newComment}
          onChange={setNewComment}
          onSubmit={(content) => handleCreateComment(content)}
          placeholder="Escribe tu comentario o pregunta..."
          isLoading={isCreating}
          showAvatar={true}
          user={user}
        />
      )}

      {/* Authentication Message */}
      {!isAuthenticated && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground text-center">
              <a href="/login" className="text-primary hover:underline">
                Inicia sesión
              </a>{" "}
              para participar en la discusión
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {commentsLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        )}

        {topLevelComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            courseId={courseId}
            canModerate={canModerate}
            currentUserId={user?.id}
            allowReplies={allowReplies}
            onReply={(parentId) => setReplyingTo(parentId)}
            onEdit={(commentId) => setEditingComment(commentId)}
            onDelete={handleDeleteComment}
            onLike={handleLikeComment}
            onPin={handlePinComment}
            replyingTo={replyingTo}
            editingComment={editingComment}
            onCancelReply={() => setReplyingTo(null)}
            onCancelEdit={() => setEditingComment(null)}
            onCreateReply={handleCreateComment}
            onUpdateComment={handleUpdateComment}
          />
        ))}

        {topLevelComments.length === 0 && !commentsLoading && (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Sé el primero en comentar este curso
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Comment Item Component
interface CommentItemProps {
  comment: CourseComment
  courseId: string
  canModerate: boolean
  currentUserId?: string
  allowReplies: boolean
  onReply: (parentId: string) => void
  onEdit: (commentId: string) => void
  onDelete: (commentId: string) => Promise<void>
  onLike: (commentId: string) => Promise<void>
  onPin: (commentId: string, isPinned: boolean) => Promise<void>
  replyingTo: string | null
  editingComment: string | null
  onCancelReply: () => void
  onCancelEdit: () => void
  onCreateReply: (content: string, parentId: string) => Promise<void>
  onUpdateComment: (commentId: string, content: string) => Promise<void>
}

function CommentItem({
  comment,
  courseId,
  canModerate,
  currentUserId,
  allowReplies,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onPin,
  replyingTo,
  editingComment,
  onCancelReply,
  onCancelEdit,
  onCreateReply,
  onUpdateComment
}: CommentItemProps) {
  const [replyContent, setReplyContent] = useState("")
  const [editContent, setEditContent] = useState(comment.content)
  const [showReplies, setShowReplies] = useState(false)
  
  const { 
    data: replies = [], 
    isLoading: repliesLoading 
  } = useGetCommentReplies(comment.id, showReplies)

  const isOwner = currentUserId === comment.userId
  const hasLiked = currentUserId && comment.likedBy.includes(currentUserId)
  const hasReplies = replies.length > 0

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return formatDistanceToNow(date, { addSuffix: true, locale: es })
    } catch {
      return "Hace un momento"
    }
  }

  return (
    <Card className={`${comment.isPinned ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
      <CardContent className="p-4 space-y-3">
        {/* Comment Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.userAvatar} />
              <AvatarFallback>
                {comment.userName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.userName}</span>
              <Badge variant="outline" className="text-xs">
                {comment.userRole}
              </Badge>
              {comment.isPinned && (
                <Pin className="h-4 w-4 text-primary" />
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
                {comment.isEdited && " • editado"}
              </span>
            </div>
          </div>

          {/* Comment Menu */}
          {(isOwner || canModerate) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner && (
                  <DropdownMenuItem onClick={() => onEdit(comment.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                )}
                {canModerate && (
                  <DropdownMenuItem onClick={() => onPin(comment.id, comment.isPinned)}>
                    <Pin className="h-4 w-4 mr-2" />
                    {comment.isPinned ? 'Desfijar' : 'Fijar'}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {(isOwner || canModerate) && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(comment.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Comment Content */}
        {editingComment === comment.id ? (
          <CommentForm
            value={editContent}
            onChange={setEditContent}
            onSubmit={(content) => onUpdateComment(comment.id, content)}
            onCancel={onCancelEdit}
            placeholder="Editar comentario..."
            submitText="Guardar cambios"
            showCancel={true}
          />
        ) : (
          <p className="text-sm leading-relaxed pl-11">
            {comment.content}
          </p>
        )}

        {/* Comment Actions */}
        <div className="flex items-center gap-4 pl-11">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(comment.id)}
            className={`gap-1 ${hasLiked ? 'text-red-500' : ''}`}
          >
            <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
            {comment.likes}
          </Button>
          
          {allowReplies && currentUserId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.id)}
            >
              <Reply className="h-4 w-4 mr-1" />
              Responder
            </Button>
          )}
          
          {hasReplies && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? 'Ocultar' : 'Ver'} respuestas ({replies.length})
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="pl-11">
            <CommentForm
              value={replyContent}
              onChange={setReplyContent}
              onSubmit={(content) => onCreateReply(content, comment.id)}
              onCancel={onCancelReply}
              placeholder="Escribe tu respuesta..."
              submitText="Responder"
              showCancel={true}
            />
          </div>
        )}

        {/* Replies */}
        {showReplies && hasReplies && (
          <div className="pl-11 space-y-3 border-l-2 border-muted ml-4">
            {replies.map((reply) => (
              <div key={reply.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.userAvatar} />
                    <AvatarFallback className="text-xs">
                      {reply.userName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{reply.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(reply.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{reply.content}</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLike(reply.id)}
                    className={`gap-1 text-xs ${reply.likedBy.includes(currentUserId || '') ? 'text-red-500' : ''}`}
                  >
                    <Heart className="h-3 w-3" />
                    {reply.likes}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Comment Form Component
interface CommentFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (content: string) => Promise<void> | void
  onCancel?: () => void
  placeholder?: string
  submitText?: string
  showCancel?: boolean
  isLoading?: boolean
  showAvatar?: boolean
  user?: any
}

function CommentForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder = "Escribe tu comentario...",
  submitText = "Publicar comentario",
  showCancel = false,
  isLoading = false,
  showAvatar = false,
  user
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(value)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        {showAvatar && user && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="resize-none"
            disabled={isSubmitting || isLoading}
          />
          <div className="flex justify-end gap-2 mt-2">
            {showCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isSubmitting || isLoading}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={!value.trim() || isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Enviando..." : submitText}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

// Comment Skeleton Component
function CommentSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
          <div className="space-y-1">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="pl-11 space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}