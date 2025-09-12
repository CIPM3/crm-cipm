"use client"
import { Course, CourseComment, CommentWithReplies } from "@/types"
import { Star, MessageCircle, Heart, Reply, MoreVertical, Edit, Trash2, Pin, Flag, RefreshCw } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGetOpinionComments, useGetCommentStats, useCommentInteractions, useCommentsObserver } from "@/hooks/queries/useComments"
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
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { ROLES } from "@/lib/constants"

interface ReviewsTabProps {
  course: Course
}

export default function ReviewsTab({ course }: ReviewsTabProps) {
  const { user } = useAuthStore()
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editCommentContent, setEditCommentContent] = useState("")

  // Set up real-time observer for comments
  useCommentsObserver(course.id)

  // Fetch only opinion comments for reviews section
  const { 
    data: allComments = [], 
    isLoading: loadingComments, 
    error: commentsError,
    refetch: refetchComments
  } = useGetOpinionComments(course.id)
  
  const {
    data: stats
  } = useGetCommentStats(course.id)

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

  // Organize comments into nested structure client-side
  const commentsWithReplies = useMemo(() => {
    if (!allComments.length) return []

    // Separate top-level comments and replies
    const topLevelComments = allComments.filter(comment => !comment.parentId)
    const replies = allComments.filter(comment => comment.parentId)

    // Group replies by parent ID
    const repliesByParent = replies.reduce((acc, reply) => {
      const parentId = reply.parentId!
      if (!acc[parentId]) acc[parentId] = []
      acc[parentId].push(reply)
      return acc
    }, {} as Record<string, CourseComment[]>)

    // Build nested structure
    return topLevelComments.map(comment => ({
      ...comment,
      replies: repliesByParent[comment.id] || [],
      replyCount: (repliesByParent[comment.id] || []).length
    }))
  }, [allComments])

  // Calculate rating distribution based on comments
  const ratingDistribution = useMemo(() => {
    if (!commentsWithReplies.length) return [
      { stars: 5, percentage: 70, count: 0 },
      { stars: 4, percentage: 20, count: 0 },
      { stars: 3, percentage: 7, count: 0 },
      { stars: 2, percentage: 2, count: 0 },
      { stars: 1, percentage: 1, count: 0 }
    ]

    // For now, we'll simulate ratings since comments don't have ratings yet
    // In the future, you could add a rating field to comments
    const totalComments = commentsWithReplies.length
    return [
      { stars: 5, percentage: Math.round((totalComments * 0.7) / totalComments * 100) || 70, count: Math.round(totalComments * 0.7) },
      { stars: 4, percentage: Math.round((totalComments * 0.2) / totalComments * 100) || 20, count: Math.round(totalComments * 0.2) },
      { stars: 3, percentage: Math.round((totalComments * 0.07) / totalComments * 100) || 7, count: Math.round(totalComments * 0.07) },
      { stars: 2, percentage: Math.round((totalComments * 0.02) / totalComments * 100) || 2, count: Math.round(totalComments * 0.02) },
      { stars: 1, percentage: Math.round((totalComments * 0.01) / totalComments * 100) || 1, count: Math.round(totalComments * 0.01) }
    ]
  }, [commentsWithReplies])

  const handleCreateComment = async () => {
    if (!user || !newComment.trim()) return

    try {
      console.log('=== DEBUGGING COMMENT CREATION ===')
      console.log('User data:', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      })
      console.log('Course ID:', course.id)
      console.log('Comment content:', newComment.trim())
      console.log('Reply to:', replyingTo)

      const commentData = {
        courseId: course.id,
        content: newComment.trim(),
        parentId: replyingTo || null,
        commentType: 'opinion' as const, // Force opinion type for reviews section
        userId: user.id,
        userName: user.name || user.email || 'Usuario',
        userRole: user.role || 'cliente',
        userAvatar: user.avatar || undefined
      }
      
      console.log('Final comment data being sent:', commentData)

      await createComment(commentData)
      
      console.log('✅ Comment created successfully')
      
      // Force refresh comments immediately
      refetchComments()
      
      setNewComment("")
      setReplyingTo(null)
    } catch (error: any) {
      console.error('=== COMMENT CREATION ERROR ===')
      console.error('Error object:', error)
      console.error('Error message:', error.message)
      console.error('Error code:', error.code)
      console.error('Error stack:', error.stack)
      
      // More detailed error message
      let errorMessage = 'Error desconocido'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && error.message) {
        errorMessage = error.message
      }
      
      alert(`Error al crear comentario: ${errorMessage}`)
    }
  }


  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return

    try {
      await deleteComment({ 
        id: commentToDelete, 
        courseId: course.id,
        hasReplies: false
      })
      
      // Force immediate state reset and cache invalidation
      setShowDeleteDialog(false)
      setCommentToDelete(null)
      
      // Force refresh comments to ensure UI consistency
      await refetchComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
      // Reset state even on error to prevent stuck modals
      setShowDeleteDialog(false)
      setCommentToDelete(null)
    }
  }

  const handleEditComment = (commentId: string) => {
    const comment = allComments.find(c => c.id === commentId)
    if (!comment) return
    
    setEditingComment(commentId)
    setEditCommentContent(comment.content)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingComment || !editCommentContent.trim()) return

    try {
      await updateComment({ 
        id: editingComment, 
        data: { content: editCommentContent.trim() },
        courseId: course.id
      })
      
      // Force immediate state reset and cache refresh
      setEditDialogOpen(false)
      setEditingComment(null)
      setEditCommentContent("")
      
      // Force refresh comments to ensure UI consistency
      await refetchComments()
    } catch (error) {
      console.error('Error updating comment:', error)
      // Reset state even on error to prevent stuck modals
      setEditDialogOpen(false)
      setEditingComment(null)
      setEditCommentContent("")
    }
  }

  const handleCancelEdit = () => {
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

  const handleLikeComment = async (commentId: string) => {
    if (!user) return

    try {
      await toggleLike({ 
        commentId, 
        userId: user.id,
        courseId: course.id 
      })
      // Don't force refetch for likes to maintain smooth UX
      // TanStack Query's optimistic updates should handle this
    } catch (error) {
      console.error('Error liking comment:', error)
      // Refresh on error to ensure state consistency
      await refetchComments()
    }
  }

  const handlePinComment = async (commentId: string, isPinned: boolean) => {
    try {
      await togglePin({ 
        commentId, 
        isPinned: !isPinned,
        courseId: course.id 
      })
      // Force refresh for pin operations to ensure proper sorting
      await refetchComments()
    } catch (error) {
      console.error('Error pinning comment:', error)
      // Refresh on error to ensure state consistency
      await refetchComments()
    }
  }

  if (loadingComments) {
    return <CommentsLoadingSkeleton />
  }

  if (commentsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar comentarios: {commentsError.message}</p>
        <pre className="text-xs mt-2 text-gray-500">{JSON.stringify(commentsError, null, 2)}</pre>
      </div>
    )
  }

  

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Rating Overview */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 xl:gap-8 items-start xl:items-center mb-4 sm:mb-6 xl:mb-8">
        {/* Overall Rating */}
        <div className="text-center xl:text-left w-full xl:w-auto">
          <div className="text-3xl sm:text-4xl xl:text-5xl font-bold">{course.rating}</div>
          <div className="flex items-center justify-center xl:justify-start mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  i < Math.floor(course.rating) 
                    ? "fill-yellow-500 text-yellow-500" 
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm sm:text-base text-muted-foreground mt-1">
            Basado en {stats?.totalComments || allComments.length} comentarios
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-1.5 sm:space-y-2 w-full max-w-sm sm:max-w-md xl:max-w-lg">
          {ratingDistribution.map(({ stars, percentage, count }) => (
            <RatingBar
              key={stars}
              stars={stars}
              percentage={percentage}
              count={count}
            />
          ))}
        </div>
      </div>

      {/* Comment Creation Form */}
      {isAuthenticated && (
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Textarea
                    placeholder={replyingTo ? "Escribe tu respuesta..." : "Comparte tu experiencia con este curso..."}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[70px] sm:min-h-[80px] lg:min-h-[100px] resize-none text-sm"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                {replyingTo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null)
                      setNewComment("")
                    }}
                    className="text-xs sm:text-sm"
                  >
                    Cancelar respuesta
                  </Button>
                )}
                
                <div className={`flex gap-2 w-full sm:w-auto ${!replyingTo ? 'sm:ml-auto' : ''}`}>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setNewComment("")}
                    disabled={!newComment.trim()}
                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleCreateComment}
                    disabled={!newComment.trim() || isCreating}
                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                  >
                    {isCreating ? 'Enviando...' : replyingTo ? 'Responder' : 'Comentar'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Statistics */}
      {stats && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2 flex-shrink-0">
            <MessageCircle className="h-4 w-4" />
            <span className="whitespace-nowrap">{stats.totalComments} comentarios</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Heart className="h-4 w-4" />
            <span className="whitespace-nowrap">{stats.totalLikes} me gusta</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Reply className="h-4 w-4" />
            <span className="whitespace-nowrap">{stats.totalReplies} respuestas</span>
          </div>
        </div>
      )}

      {/* Comments List */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Comentarios de los estudiantes</h2>
        </div>
        
        {commentsWithReplies.length === 0 ? (
          <EmptyCommentsState />
        ) : (
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {commentsWithReplies.map((comment: CommentWithReplies) => (
              <CommentWithRepliesCard
                key={`comment-${comment.id}-${comment.updatedAt?.seconds || comment.createdAt?.seconds}`}
                comment={comment}
                currentUserId={user?.id}
                canModerate={canModerate}
                onReply={setReplyingTo}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onLike={handleLikeComment}
                onPin={handlePinComment}
              />
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Eliminar comentario
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              ¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.
              {commentToDelete && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-red-200">
                  <p className="text-sm text-gray-700 font-medium mb-1">Vista previa del comentario:</p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {allComments.find(c => c.id === commentToDelete)?.content || ""}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row">
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
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Comment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        if (!open) {
          handleCancelEdit()
        } else {
          // Ensure we have the latest content when opening
          const currentComment = allComments.find(c => c.id === editingComment)
          if (currentComment && editCommentContent !== currentComment.content) {
            setEditCommentContent(currentComment.content)
          }
        }
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Editar comentario
            </DialogTitle>
            <DialogDescription>
              Modifica el contenido de tu comentario. Los cambios se marcarán como editados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">Editando comentario</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Textarea
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
                placeholder="Escribe tu comentario..."
                className="min-h-[120px] resize-none focus:ring-blue-500 focus:border-blue-500"
                autoFocus
                maxLength={2000}
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{editCommentContent.length}/2000 caracteres</span>
                {editCommentContent !== (allComments.find(c => c.id === editingComment)?.content || "") && (
                  <span className="text-amber-600 font-medium">● Cambios sin guardar</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancelEdit}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveEdit}
              disabled={!editCommentContent.trim() || isCreating || 
                       editCommentContent === (allComments.find(c => c.id === editingComment)?.content || "")}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Guardar cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// === RATING BAR COMPONENT ===

interface RatingBarProps {
  stars: number
  percentage: number
  count: number
}

function RatingBar({ stars, percentage, count }: RatingBarProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
      <div className="flex items-center gap-1 w-8 sm:w-10 lg:w-12 flex-shrink-0">
        <span className="text-xs sm:text-sm">{stars}</span>
        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-500 text-yellow-500" />
      </div>
      <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden min-w-0">
        <div 
          className="h-full bg-yellow-500 rounded-full transition-all duration-300" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground w-6 sm:w-8 lg:w-10 text-right flex-shrink-0">
        {count}
      </span>
    </div>
  )
}

// === COMMENT WITH REPLIES CARD COMPONENT ===

interface CommentWithRepliesCardProps {
  comment: CommentWithReplies
  currentUserId?: string
  canModerate: boolean
  onReply: (commentId: string) => void
  onEdit: (commentId: string) => void
  onDelete: (commentId: string) => void
  onLike: (commentId: string) => void
  onPin: (commentId: string, isPinned: boolean) => void
}

function CommentWithRepliesCard({ 
  comment, 
  currentUserId, 
  canModerate,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onPin
}: CommentWithRepliesCardProps) {
  return (
    <div className="space-y-4">
      {/* Main Comment */}
      <CommentCard 
        comment={comment}
        currentUserId={currentUserId}
        canModerate={canModerate}
        onReply={onReply}
        onEdit={onEdit}
        onDelete={onDelete}
        onLike={onLike}
        onPin={onPin}
      />
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-2 sm:ml-4 lg:ml-8 xl:ml-12 space-y-2 sm:space-y-3 lg:space-y-4 border-l-2 border-gray-100 pl-2 sm:pl-3 lg:pl-4 xl:pl-6">
          <div className="text-xs text-gray-500 font-medium">
            {comment.replies.length} respuesta{comment.replies.length !== 1 ? 's' : ''}
          </div>
          {comment.replies.map((reply: CourseComment) => (
            <CommentCard 
              key={`reply-${reply.id}-${reply.updatedAt?.seconds || reply.createdAt?.seconds}`}
              comment={reply}
              currentUserId={currentUserId}
              canModerate={canModerate}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onPin={onPin}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// === COMMENT CARD COMPONENT ===

interface CommentCardProps {
  comment: CourseComment
  currentUserId?: string
  canModerate: boolean
  onReply: (commentId: string) => void
  onEdit: (commentId: string) => void
  onDelete: (commentId: string) => void
  onLike: (commentId: string) => void
  onPin: (commentId: string, isPinned: boolean) => void
  isReply?: boolean
}

function CommentCard({ 
  comment, 
  currentUserId, 
  canModerate,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onPin,
  isReply = false
}: CommentCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user } = useAuthStore()
  const isOwner = currentUserId === comment.userId
  const canDelete = isOwner || user?.role === ROLES.ADMIN || user?.role === ROLES.DEVELOP
  const hasLiked = currentUserId && comment.likedBy?.includes(currentUserId)
  
  // Close dropdown when component re-renders (after operations)
  useEffect(() => {
    setDropdownOpen(false)
  }, [comment.content, comment.likes, comment.isPinned])
  
  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Badge variant="destructive" className="text-xs">Admin</Badge>
      case 'instructor':
        return <Badge variant="default" className="text-xs">Instructor</Badge>
      case 'develop':
        return <Badge variant="secondary" className="text-xs">Developer</Badge>
      default:
        return null
    }
  }

  return (
    <Card className={`${comment.isPinned ? 'ring-1 sm:ring-2 ring-blue-200 bg-blue-50/30' : ''} ${isReply ? 'bg-gray-50/50' : ''}`}>
      <CardContent className={`${isReply ? 'p-2 sm:p-3 lg:p-4' : 'p-3 sm:p-4 lg:p-6'}`}>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {/* Comment Header */}
          <div className="flex items-start justify-between gap-1 sm:gap-2">
            <div className="flex items-start gap-1.5 sm:gap-2 lg:gap-3 flex-1 min-w-0">
              {isReply && (
                <Reply className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              )}
              <Avatar className={`${isReply ? 'h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8' : 'h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10'} flex-shrink-0`}>
                <AvatarImage src={comment.userAvatar} />
                <AvatarFallback>
                  {comment.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                  {isReply && (
                    <span className="text-xs text-gray-500 hidden lg:inline">Respondiendo:</span>
                  )}
                  <h4 className={`font-semibold ${isReply ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm lg:text-base'} truncate`}>
                    {comment.userName}
                  </h4>
                  {getRoleBadge(comment.userRole)}
                  {comment.isPinned && (
                    <Pin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {comment.createdAt && formatDistanceToNow(
                    new Date(comment.createdAt.seconds * 1000), 
                    { addSuffix: true, locale: es }
                  )}
                  {comment.isEdited && (
                    <span className="ml-1">(editado)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Actions Menu */}
            {(isOwner || canModerate || canDelete) && (
              <div className="flex-shrink-0">
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 p-0">
                      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isOwner && (
                      <>
                        <DropdownMenuItem 
                          onClick={() => {
                            setDropdownOpen(false)
                            onEdit(comment.id)
                          }}
                          className="focus:bg-blue-50 focus:text-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {canDelete && (
                      <DropdownMenuItem 
                        onClick={() => {
                          setDropdownOpen(false)
                          onDelete(comment.id)
                        }}
                        className="text-red-600 focus:bg-red-50 focus:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    )}
                    
                    {canModerate && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setDropdownOpen(false)
                          onPin(comment.id, comment.isPinned)
                        }}>
                          <Pin className="h-4 w-4 mr-2" />
                          {comment.isPinned ? 'Desanclar' : 'Anclar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setDropdownOpen(false)
                          // TODO: Implement moderation functionality
                        }}>
                          <Flag className="h-4 w-4 mr-2" />
                          Moderar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Comment Content */}
          <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed break-words">{comment.content}</p>

          {/* Comment Actions */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-4 pt-1 sm:pt-2">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ${
                hasLiked ? 'text-red-600 bg-red-50' : 'text-gray-500'
              }`}
              disabled={!currentUserId}
            >
              <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${hasLiked ? 'fill-current' : ''}`} />
              <span className="whitespace-nowrap text-xs">{comment.likes || 0}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1 text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0"
                disabled={!currentUserId}
              >
                <Reply className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap hidden sm:inline">Responder</span>
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// === LOADING SKELETON COMPONENT ===

function CommentsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// === EMPTY STATE COMPONENT ===

function EmptyCommentsState() {
  return (
    <div className="text-center py-8 sm:py-12">
      <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
        No hay comentarios aún
      </h3>
      <p className="text-sm sm:text-base text-gray-500 mb-2 sm:mb-4">
        Sé el primero en compartir tu experiencia con este curso
      </p>
      <p className="text-xs sm:text-sm text-gray-400">
        Los comentarios ayudan a otros estudiantes a decidirse
      </p>
    </div>
  )
}