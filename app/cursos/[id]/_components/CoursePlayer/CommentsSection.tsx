import { useState, useEffect, useMemo } from "react"
import { MessageCircle, Heart, Pin, MoreHorizontal, Loader2, AlertCircle, Send, Video, BookOpen } from "lucide-react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useAuthStore } from "@/store/useAuthStore"
import { 
  useGetCommentsWithReplies, 
  useGetVideoComments,
  useGetOpinionComments,
  useCreateComment,
  useLikeComment,
  usePinComment,
  useUpdateComment,
  useDeleteComment,
  useCommentsObserver
} from "@/hooks/queries/useComments"
import { CourseComment, CommentWithReplies } from "@/types"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface CommentsSectionProps {
  courseId: string
  contentId?: string // Optional: for content-specific comments
  contentTitle?: string // Optional: title of the current content
}

export default function CommentsSection({ courseId, contentId, contentTitle }: CommentsSectionProps) {
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [commentTypeFilter, setCommentTypeFilter] = useState<'video' | 'opinion' | 'all'>('video') // Toggle for comment types
  
  const { user } = useAuthStore()
  
  // Set up real-time comment observer only if courseId exists
  useCommentsObserver(courseId || '')
  
  // Fetch different types of comments based on filter
  const { data: allComments = [], isLoading: loadingAll, error: errorAll, refetch: refetchAll } = useGetCommentsWithReplies(courseId || '')
  const { data: videoComments = [], isLoading: loadingVideo, error: errorVideo, refetch: refetchVideo } = useGetVideoComments(
    courseId || '', 
    contentId || '', 
    commentTypeFilter === 'video' && !!contentId
  )
  const { data: opinionComments = [], isLoading: loadingOpinion, error: errorOpinion, refetch: refetchOpinion } = useGetOpinionComments(
    courseId || '', 
    commentTypeFilter === 'opinion'
  )
  
  // Determine which data to use based on filter
  const comments = useMemo(() => {
    switch (commentTypeFilter) {
      case 'video':
        return contentId ? videoComments : []
      case 'opinion':
        return opinionComments
      case 'all':
      default:
        return allComments
    }
  }, [commentTypeFilter, videoComments, opinionComments, allComments, contentId])
  
  const isLoading = useMemo(() => {
    switch (commentTypeFilter) {
      case 'video':
        return loadingVideo
      case 'opinion':
        return loadingOpinion
      case 'all':
      default:
        return loadingAll
    }
  }, [commentTypeFilter, loadingVideo, loadingOpinion, loadingAll])
  
  const error = useMemo(() => {
    switch (commentTypeFilter) {
      case 'video':
        return errorVideo
      case 'opinion':
        return errorOpinion
      case 'all':
      default:
        return errorAll
    }
  }, [commentTypeFilter, errorVideo, errorOpinion, errorAll])
  
  const refetch = useMemo(() => {
    switch (commentTypeFilter) {
      case 'video':
        return refetchVideo
      case 'opinion':
        return refetchOpinion
      case 'all':
      default:
        return refetchAll
    }
  }, [commentTypeFilter, refetchVideo, refetchOpinion, refetchAll])
  
  // Comment mutations
  const createMutation = useCreateComment()
  const likeMutation = useLikeComment()
  const pinMutation = usePinComment()
  const updateMutation = useUpdateComment()
  const deleteMutation = useDeleteComment()
  
  // Determine context for new comments based on current filter
  const getCommentTypeForCreation = () => {
    switch (commentTypeFilter) {
      case 'video':
        return 'video' as const
      case 'opinion':
        return 'opinion' as const
      default:
        return 'general' as const
    }
  }
  
  // Check user permissions
  const canModerate = useMemo(() => {
    if (!user) return false
    return ['admin', 'instructor', 'develop'].includes(user.role?.toLowerCase() || '')
  }, [user?.role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user || isSubmitting || !courseId) return
    
    setIsSubmitting(true)
    try {
      const commentType = getCommentTypeForCreation()
      await createMutation.mutateAsync({
        courseId,
        content: input.trim(),
        parentId: replyingTo,
        commentType,
        contentId: commentType === 'video' ? contentId : undefined,
        contentTitle: commentType === 'video' ? contentTitle : undefined,
        userId: user.id,
        userName: user.name || user.email || 'Usuario',
        userRole: user.role || 'cliente',
        userAvatar: user.avatar
      })
      
      setInput("")
      setReplyingTo(null)
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleLike = async (commentId: string) => {
    if (!user) return
    try {
      await likeMutation.mutateAsync({ commentId, userId: user.id, courseId })
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }
  
  const handlePin = async (commentId: string, isPinned: boolean) => {
    if (!canModerate) return
    try {
      await pinMutation.mutateAsync({ commentId, isPinned: !isPinned, courseId })
    } catch (error) {
      console.error('Error pinning comment:', error)
    }
  }
  
  const handleEdit = (comment: CourseComment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }
  
  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return
    try {
      await updateMutation.mutateAsync({ 
        id: commentId, 
        data: { content: editContent.trim() },
        courseId 
      })
      setEditingComment(null)
      setEditContent("")
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }
  
  const handleDelete = async (commentId: string) => {
    const hasReplies = comments.some(c => c.replies && c.replies.length > 0 && c.id === commentId)
    try {
      await deleteMutation.mutateAsync({ id: commentId, courseId, hasReplies })
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }
  
  const handleReply = (parentId: string) => {
    setReplyingTo(parentId)
    // Focus on textarea after state update
    setTimeout(() => {
      const textarea = document.getElementById('comment-textarea')
      if (textarea) textarea.focus()
    }, 100)
  }

  // Don't render if courseId is not available
  if (!courseId) {
    return (
      <div className="mt-8 flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-muted-foreground">Cargando curso...</span>
      </div>
    )
  }

  return (
    <div className="mt-6 sm:mt-8 ">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4 lg:gap-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm"></div>
            <div className="relative bg-primary/10 p-2.5 rounded-full">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-xl tracking-tight">
              Comentarios
            </h2>
            <p className="text-sm text-muted-foreground">
              {comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}
              {error && (
                <span className="inline-flex items-center gap-1 ml-2 text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  Error al cargar
                </span>
              )}
            </p>
          </div>
        </div>
        
        {/* Enhanced Comment Type Filter */}
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-xl p-1.5 border shadow-sm overflow-x-auto scrollbar-hide">
          {contentId && (
            <Button
              variant={commentTypeFilter === 'video' ? "default" : "ghost"}
              size="sm"
              className={`h-9 px-4 text-sm font-medium transition-all duration-200 ${
                commentTypeFilter === 'video' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-muted/80'
              }`}
              onClick={() => setCommentTypeFilter('video')}
            >
              <Video className="h-4 w-4 mr-2" />
              Video
            </Button>
          )}
          <Button
            variant={commentTypeFilter === 'opinion' ? "default" : "ghost"}
            size="sm"
            className={`h-9 px-4 text-sm font-medium transition-all duration-200 ${
              commentTypeFilter === 'opinion' 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'hover:bg-muted/80'
            }`}
            onClick={() => setCommentTypeFilter('opinion')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Opiniones
          </Button>
          <Button
            variant={commentTypeFilter === 'all' ? "default" : "ghost"}
            size="sm"
            className={`h-9 px-4 text-sm font-medium transition-all duration-200 ${
              commentTypeFilter === 'all' 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'hover:bg-muted/80'
            }`}
            onClick={() => setCommentTypeFilter('all')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Todos
          </Button>
        </div>
      </div>
      
      {/* Enhanced Context Indicator */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 via-background to-primary/5 border border-primary/10 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            {commentTypeFilter === 'video' && contentId ? (
              <Video className="h-4 w-4 text-primary" />
            ) : commentTypeFilter === 'opinion' ? (
              <MessageCircle className="h-4 w-4 text-primary" />
            ) : (
              <BookOpen className="h-4 w-4 text-primary" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {commentTypeFilter === 'video' && contentId ? (
                <>Comentarios del video: <span className="text-primary font-semibold">{contentTitle || 'Esta lección'}</span></>
              ) : commentTypeFilter === 'opinion' ? (
                'Opiniones y reseñas del curso'
              ) : (
                'Todos los comentarios del curso'
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {commentTypeFilter === 'video' 
                ? 'Comparte tus dudas o reflexiones sobre este contenido específico'
                : commentTypeFilter === 'opinion'
                  ? 'Ayuda a otros estudiantes compartiendo tu experiencia'
                  : 'Vista completa de toda la conversación del curso'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Add Comment Form */}
      {user ? (
        <div className="mb-6 p-6 bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 rounded-xl shadow-sm">
          <form onSubmit={handleSubmit}>
            {replyingTo && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-primary/20 rounded-full">
                      <MessageCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span className="font-medium text-sm">Respondiendo a comentario</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs hover:bg-primary/10"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <UserAvatar 
                user={user} 
                size="lg"
                className="flex-shrink-0 mt-1 shadow-sm ring-2 ring-background"
              />
              
              <div className="flex-1 relative">
                <textarea
                  id="comment-textarea"
                  className="w-full border-2 border-muted-foreground/20 rounded-xl p-4 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 bg-background/80 backdrop-blur-sm text-sm transition-all duration-200 placeholder:text-muted-foreground/60"
                  rows={3}
                  placeholder={
                    replyingTo 
                      ? "Escribe tu respuesta..." 
                      : commentTypeFilter === 'video' && contentId
                        ? `Comenta sobre este video: "${contentTitle || 'esta lección'}"...`
                        : commentTypeFilter === 'opinion'
                          ? "Comparte tu opinión sobre el curso..."
                          : "Escribe tu comentario..."
                  }
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute bottom-3 right-3 h-8 w-8 rounded-lg shadow-md transition-all duration-200 hover:scale-105"
                  disabled={!input.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                💡 Mantén un lenguaje respetuoso y constructivo
              </span>
              <span>{input.length}/500</span>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Inicia sesión para participar en la conversación</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-muted-foreground">Cargando comentarios...</span>
        </div>
      )}

      {/* Error State */}
      {/* {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Error al cargar comentarios</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            No se pudieron cargar los comentarios. 
            <Button variant="link" className="p-0 h-auto" onClick={() => refetch()}>
              Intentar nuevamente
            </Button>
          </p>
        </div>
      )} */}

      {/* Comments List */}
      {!isLoading && !error && (
        <div className="space-y-4 sm:space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">
                {commentTypeFilter === 'video' && contentId 
                  ? "Aún no hay comentarios para este video"
                  : commentTypeFilter === 'opinion'
                    ? "Aún no hay opiniones sobre el curso"
                    : "Aún no hay comentarios"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {commentTypeFilter === 'video' 
                  ? "Sé el primero en comentar sobre este video"
                  : commentTypeFilter === 'opinion'
                    ? "Sé el primero en compartir tu opinión"
                    : "Sé el primero en comentar"}
              </p>
            </div>
          ) : (
            comments.map((comment: CommentWithReplies) => (
              <CommentItem 
                key={comment.id} 
                comment={comment}
                currentUser={user}
                canModerate={canModerate}
                isEditing={editingComment === comment.id}
                editContent={editContent}
                onSetEditContent={setEditContent}
                onLike={() => handleLike(comment.id)}
                onPin={() => handlePin(comment.id, comment.isPinned)}
                onReply={() => handleReply(comment.id)}
                onEdit={() => handleEdit(comment)}
                onSaveEdit={() => handleSaveEdit(comment.id)}
                onCancelEdit={() => {
                  setEditingComment(null)
                  setEditContent("")
                }}
                onDelete={() => handleDelete(comment.id)}
                isLiking={likeMutation.isPending}
                isPinning={pinMutation.isPending}
                isUpdating={updateMutation.isPending}
                isDeleting={deleteMutation.isPending}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

interface CommentItemProps {
  comment: CommentWithReplies
  currentUser?: any
  canModerate: boolean
  isEditing: boolean
  editContent: string
  onSetEditContent: (content: string) => void
  onLike: () => void
  onPin: () => void
  onReply: () => void
  onEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
  isLiking: boolean
  isPinning: boolean
  isUpdating: boolean
  isDeleting: boolean
}

function CommentItem({ 
  comment, 
  currentUser, 
  canModerate,
  isEditing,
  editContent,
  onSetEditContent,
  onLike, 
  onPin, 
  onReply, 
  onEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onDelete,
  isLiking,
  isPinning,
  isUpdating,
  isDeleting
}: CommentItemProps) {
  const canEdit = currentUser && (currentUser.id === comment.userId || canModerate)
  const canDelete = currentUser && (currentUser.id === comment.userId || canModerate)
  const isLiked = comment.likedBy?.includes(currentUser?.id || '') || false
  
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'hace un momento'
    try {
      const date = new Date(timestamp.seconds * 1000)
      return formatDistanceToNow(date, { addSuffix: true, locale: es })
    } catch {
      return 'hace un momento'
    }
  }
  
  return (
    <div className={`transition-all duration-200 hover:shadow-md group rounded-xl p-5 ${
      comment.isPinned 
        ? 'bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border border-primary/30 shadow-lg relative' 
        : 'bg-gradient-to-br from-background via-background to-muted/10 border border-border/30'
    } ${
      comment.isModerated 
        ? 'opacity-60' 
        : ''
    }`}>
      {comment.isPinned && (
        <div className="absolute -top-2 -right-2 p-1.5 bg-primary rounded-full shadow-lg">
          <Pin className="h-3 w-3 text-primary-foreground" />
        </div>
      )}
      {/* Enhanced Comment Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <UserAvatar 
              user={{
                id: comment.userId,
                name: comment.userName,
                email: '',
                role: comment.userRole,
                avatar: comment.userAvatar || ''
              }}
              size="lg"
              className="shadow-sm ring-2 ring-background"
            />
            {['admin', 'instructor'].includes(comment.userRole?.toLowerCase() || '') && (
              <div className="absolute -bottom-1 -right-1 p-0.5 bg-primary rounded-full">
                <MessageCircle className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{comment.userName || 'Usuario'}</span>
              {['admin', 'instructor'].includes(comment.userRole?.toLowerCase() || '') && (
                <span className="bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-xs px-2 py-1 rounded-full border border-primary/20 font-medium">
                  {comment.userRole === 'admin' ? 'Admin' : 'Instructor'}
                </span>
              )}
              {comment.isEdited && (
                <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">(editado)</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatTime(comment.createdAt)}
              </span>
              {comment.commentType && (
                <span className="text-xs text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                  {comment.commentType === 'video' ? 'Video' : comment.commentType === 'opinion' ? 'Opinión' : 'General'}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Menu */}
        {(canEdit || canDelete || canModerate) && (
          <div className="flex items-center gap-1">
            {canModerate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onPin}
                disabled={isPinning}
                title={comment.isPinned ? 'Desanclar' : 'Anclar comentario'}
              >
                {isPinning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Pin className={`h-4 w-4 ${comment.isPinned ? 'text-primary' : ''}` } />
                )}
              </Button>
            )}
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onEdit}
                disabled={isEditing || isUpdating}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            rows={3}
            value={editContent}
            onChange={e => onSetEditContent(e.target.value)}
            disabled={isUpdating}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={onSaveEdit}
              disabled={!editContent.trim() || isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-3 text-sm leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </div>
      )}

      {/* Comment Actions */}
      <div className="flex items-center gap-4 text-sm">
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-2 text-xs ${
            isLiked 
              ? 'text-red-600 hover:text-red-700' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={onLike}
          disabled={!currentUser || isLiking}
        >
          {isLiking ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
          )}
          {comment.likes || 0}
        </Button>
        
        {currentUser && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={onReply}
          >
            Responder
          </Button>
        )}
        
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-destructive hover:text-destructive/80"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        )}
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 pl-3 sm:pl-6 border-l-2 border-muted">
          {comment.replies.map(reply => (
            <div key={reply.id} className="bg-background/80 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2 mb-2">
                <UserAvatar 
                  user={{
                    id: reply.userId,
                    name: reply.userName,
                    email: '',
                    role: reply.userRole,
                    avatar: reply.userAvatar || ''
                  }}
                  size="sm"
                  className="shadow-sm"
                />
                <span className="font-medium text-xs sm:text-sm">{reply.userName || 'Usuario'}</span>
                {['admin', 'instructor'].includes(reply.userRole?.toLowerCase() || '') && (
                  <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                    {reply.userRole === 'admin' ? 'Admin' : 'Instructor'}
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatTime(reply.createdAt)}
                </span>
              </div>
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {reply.content}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 px-2 text-xs ${
                    reply.likedBy?.includes(currentUser?.id || '')
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => {
                    // Reply likes would need separate handler - for now disabled
                    console.log('Reply like clicked:', reply.id)
                  }}
                  disabled={!currentUser}
                >
                  <Heart className={`h-3 w-3 mr-1 ${
                    reply.likedBy?.includes(currentUser?.id || '') ? 'fill-current' : ''
                  }`} />
                  {reply.likes || 0}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}