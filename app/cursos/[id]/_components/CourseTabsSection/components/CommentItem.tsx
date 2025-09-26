import { useState } from "react"
import { CourseComment } from "@/types"
import { Star, Heart, Reply, MoreVertical, Edit, Trash2, Pin, Flag } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import CommentForm from "./CommentForm"

interface CommentItemProps {
  comment: CourseComment
  replies?: CourseComment[]
  currentUserId?: string
  canModerate: boolean
  isAuthenticated: boolean
  onReply: (content: string, parentId: string) => Promise<void>
  onEdit: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => void
  onToggleLike: (commentId: string) => Promise<void>
  onTogglePin: (commentId: string, isPinned: boolean) => Promise<void>
  onToggleModeration: (commentId: string) => Promise<void>
  isSubmitting?: boolean
}

export default function CommentItem({
  comment,
  replies = [],
  currentUserId,
  canModerate,
  isAuthenticated,
  onReply,
  onEdit,
  onDelete,
  onToggleLike,
  onTogglePin,
  onToggleModeration,
  isSubmitting = false
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  const isOwner = currentUserId === comment.userId
  const hasLiked = comment.likedBy?.includes(currentUserId || '') || false
  const canEdit = isOwner || canModerate
  const canDelete = isOwner || canModerate

  const handleReply = async (content: string) => {
    await onReply(content, comment.id)
    setShowReplyForm(false)
  }

  const handleEdit = async () => {
    if (!editContent.trim()) return
    await onEdit(comment.id, editContent)
    setIsEditMode(false)
  }

  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setIsEditMode(false)
  }

  return (
    <div className="space-y-3">
      <Card className={`${comment.isPinned ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src={comment.userAvatar} />
              <AvatarFallback>
                {comment.userName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {comment.userName}
                  </h4>
                  {comment.userRole && (
                    <Badge variant="secondary" className="text-xs">
                      {comment.userRole}
                    </Badge>
                  )}
                  {comment.isPinned && (
                    <Badge variant="default" className="text-xs bg-blue-600">
                      <Pin className="h-3 w-3 mr-1" />
                      Fijado
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {comment.rating && (
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= comment.rating!
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {(canEdit || canDelete || canModerate) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEdit && (
                          <DropdownMenuItem onClick={() => setIsEditMode(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {canModerate && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => onTogglePin(comment.id, !comment.isPinned)}
                            >
                              <Pin className="h-4 w-4 mr-2" />
                              {comment.isPinned ? 'Desfijar' : 'Fijar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onToggleModeration(comment.id)}
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              {comment.isModerated ? 'Desmoderar' : 'Moderar'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {canDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(comment.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-2">
                {formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), {
                  addSuffix: true,
                  locale: es,
                })}
                {comment.isEdited && " (editado)"}
              </p>
              
              {isEditMode ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded-md resize-none min-h-[80px]"
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleEdit} disabled={isSubmitting}>
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    {isAuthenticated && (
                      <>
                        <button
                          onClick={() => onToggleLike(comment.id)}
                          className={`flex items-center space-x-1 transition-colors ${
                            hasLiked 
                              ? "text-red-600" 
                              : "text-gray-500 hover:text-red-600"
                          }`}
                          disabled={isSubmitting}
                        >
                          <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                          <span>{comment.likes || 0}</span>
                        </button>
                        
                        <button
                          onClick={() => setShowReplyForm(!showReplyForm)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Reply className="h-4 w-4" />
                          <span>Responder</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {showReplyForm && isAuthenticated && (
        <div className="ml-8 sm:ml-12">
          <CommentForm
            onSubmit={handleReply}
            isSubmitting={isSubmitting}
            placeholder="Escribe tu respuesta..."
            showRating={false}
            autoFocus
          />
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-8 sm:ml-12 space-y-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              canModerate={canModerate}
              isAuthenticated={isAuthenticated}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleLike={onToggleLike}
              onTogglePin={onTogglePin}
              onToggleModeration={onToggleModeration}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  )
}