import { useState, memo } from 'react'
import { Heart, Reply, MoreVertical, Edit, Trash2, Pin, Flag } from "lucide-react"
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
import { CourseComment } from "@/types"
import { ROLES } from "@/lib/constants"

interface CommentCardProps {
  comment: CourseComment & { replies?: CourseComment[], replyCount?: number }
  currentUserId?: string
  canModerate?: boolean
  onLike: (commentId: string) => void
  onReply: (commentId: string) => void
  onEdit: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  onPin?: (commentId: string, isPinned: boolean) => void
  isReply?: boolean
}

export const CommentCard = memo(({
  comment,
  currentUserId,
  canModerate = false,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onPin,
  isReply = false
}: CommentCardProps) => {
  const [showReplies, setShowReplies] = useState(false)

  const hasLiked = currentUserId ? comment.likedBy?.includes(currentUserId) : false
  const canEditOrDelete = currentUserId === comment.userId || canModerate
  const isInstructor = comment.userRole === ROLES.INSTRUCTOR
  const isAdmin = comment.userRole === ROLES.ADMIN
  const isPinned = comment.isPinned

  const handleLikeWithHaptic = () => {
    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    onLike(comment.id)
  }

  return (
    <Card className={`${isPinned ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''} ${isReply ? 'ml-4 sm:ml-12' : ''}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* User Avatar */}
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
            <AvatarImage 
              src={comment.userAvatar} 
              alt={comment.userName} 
            />
            <AvatarFallback className="text-xs sm:text-sm font-medium">
              {comment.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* User Info and Actions */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-sm sm:text-base truncate">
                    {comment.userName}
                  </h4>
                  
                  {/* Role Badges */}
                  {isAdmin && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                      Admin
                    </Badge>
                  )}
                  {isInstructor && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      Instructor
                    </Badge>
                  )}
                  {isPinned && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      <Pin className="h-3 w-3 mr-1" />
                      Fijado
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {formatDistanceToNow(comment.createdAt.toDate(), { 
                    addSuffix: true, 
                    locale: es 
                  })}
                  {comment.updatedAt && comment.updatedAt.toDate().getTime() !== comment.createdAt.toDate().getTime() && (
                    <span className="ml-2 text-gray-400">(editado)</span>
                  )}
                </p>
              </div>

              {/* Actions Menu */}
              {currentUserId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {canEditOrDelete && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onEdit(comment.id, comment.content)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Editar comentario
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(comment.id)}
                          className="flex items-center gap-2 text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar comentario
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    {canModerate && onPin && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onPin(comment.id, isPinned)}
                          className="flex items-center gap-2"
                        >
                          <Pin className="h-4 w-4" />
                          {isPinned ? 'Desfijar' : 'Fijar'} comentario
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <DropdownMenuItem
                      onClick={() => console.log('Report comment:', comment.id)}
                      className="flex items-center gap-2 text-red-600 focus:text-red-600"
                    >
                      <Flag className="h-4 w-4" />
                      Reportar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Comment Content */}
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words mb-3">
              {comment.content}
            </p>

            {/* Comment Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <button
                onClick={handleLikeWithHaptic}
                className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors touch-manipulation ${
                  hasLiked ? 'text-red-600 bg-red-50' : 'text-gray-500'
                }`}
                disabled={!currentUserId}
                style={{ minHeight: '32px' }}
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span className="whitespace-nowrap">{comment.likes || 0}</span>
              </button>
              
              {!isReply && (
                <button
                  onClick={() => onReply(comment.id)}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors touch-manipulation"
                  disabled={!currentUserId}
                  style={{ minHeight: '32px' }}
                >
                  <Reply className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">Responder</span>
                </button>
              )}

              {!isReply && comment.replyCount && comment.replyCount > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors touch-manipulation"
                  style={{ minHeight: '32px' }}
                >
                  {showReplies ? 'Ocultar' : 'Ver'} {comment.replyCount} respuesta{comment.replyCount > 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Replies */}
        {!isReply && showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-3">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                canModerate={canModerate}
                onLike={onLike}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onPin={onPin}
                isReply={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
})