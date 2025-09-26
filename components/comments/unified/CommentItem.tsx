"use client"

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  Heart, 
  Reply, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Pin, 
  Flag,
  MessageCircle
} from 'lucide-react'
import { CourseComment } from '@/types'
import { useComments } from './CommentsProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CommentForm from './CommentForm'
import CommentReplies from './CommentReplies'

interface CommentItemProps {
  comment: CourseComment
  level?: number
  showReplies?: boolean
}

export default function CommentItem({ 
  comment, 
  level = 0, 
  showReplies = true 
}: CommentItemProps) {
  const {
    config,
    actions,
    ui,
    permissions
  } = useComments()
  
  const [showLocalReplies, setShowLocalReplies] = useState(false)
  const [isLiked, setIsLiked] = useState(comment.isLiked || false)
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0)

  const isReplying = ui.replyingTo === comment.id
  const isEditing = ui.editingComment === comment.id
  const canReply = config.allowReplies && level < 2 // Max 2 levels of nesting
  
  const handleLike = async () => {
    try {
      await actions.toggleLike(comment.id)
      setIsLiked(!isLiked)
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleEdit = () => {
    ui.setEditingComment(comment.id)
    ui.setReplyingTo(null)
  }

  const handleReply = () => {
    ui.setReplyingTo(comment.id)
    ui.setEditingComment(null)
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        await actions.deleteComment(comment.id)
      } catch (error) {
        console.error('Error deleting comment:', error)
      }
    }
  }

  const handlePin = async () => {
    try {
      await actions.togglePin?.(comment.id)
    } catch (error) {
      console.error('Error toggling pin:', error)
    }
  }

  const handleModeration = async () => {
    try {
      await actions.toggleModeration?.(comment.id)
    } catch (error) {
      console.error('Error toggling moderation:', error)
    }
  }

  const handleCancelEdit = () => {
    ui.setEditingComment(null)
  }

  const handleCancelReply = () => {
    ui.setReplyingTo(null)
  }

  return (
    <Card className={`${level > 0 ? 'ml-8 mt-2' : 'mb-4'}`}>
      <CardContent className="p-4">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.authorAvatar} />
              <AvatarFallback>
                {comment.authorName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {comment.authorName || 'Usuario'}
                </span>
                
                {comment.isPinned && (
                  <Badge variant="secondary" className="text-xs">
                    <Pin className="h-3 w-3 mr-1" />
                    Fijado
                  </Badge>
                )}
                
                {comment.status === 'pending' && (
                  <Badge variant="outline" className="text-xs">
                    Pendiente
                  </Badge>
                )}
              </div>
              
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { 
                  addSuffix: true, 
                  locale: es 
                })}
                {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                  <span className="ml-1">(editado)</span>
                )}
              </span>
            </div>
          </div>

          {/* Actions Menu */}
          {(permissions.canEdit(comment) || permissions.canDelete(comment) || permissions.canModerate) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {permissions.canEdit(comment) && (
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                )}
                
                {permissions.canDelete(comment) && (
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                )}
                
                {permissions.canPin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handlePin}>
                      <Pin className="h-4 w-4 mr-2" />
                      {comment.isPinned ? 'Desfijar' : 'Fijar'}
                    </DropdownMenuItem>
                  </>
                )}
                
                {permissions.canModerate && (
                  <DropdownMenuItem onClick={handleModeration}>
                    <Flag className="h-4 w-4 mr-2" />
                    {comment.status === 'approved' ? 'Moderar' : 'Aprobar'}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="mt-2">
            <CommentForm
              initialContent={comment.content}
              onSubmit={async (content) => {
                await actions.updateComment(comment.id, { content })
                ui.setEditingComment(null)
              }}
              onCancel={handleCancelEdit}
              submitLabel="Guardar cambios"
              placeholder="Edita tu comentario..."
            />
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-sm">{comment.content}</p>
          </div>
        )}

        {/* Comment Actions */}
        {!isEditing && (
          <div className="flex items-center space-x-4 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-xs ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likeCount > 0 && likeCount}
            </Button>

            {canReply && permissions.canComment && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReply}
                className="text-xs text-muted-foreground"
              >
                <Reply className="h-3 w-3 mr-1" />
                Responder
              </Button>
            )}

            {showReplies && comment.replyCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocalReplies(!showLocalReplies)}
                className="text-xs text-muted-foreground"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                {comment.replyCount} {comment.replyCount === 1 ? 'respuesta' : 'respuestas'}
              </Button>
            )}
          </div>
        )}

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-4">
            <CommentForm
              onSubmit={async (content) => {
                await actions.createComment({
                  content,
                  parentId: comment.id
                })
                ui.setReplyingTo(null)
                setShowLocalReplies(true)
              }}
              onCancel={handleCancelReply}
              submitLabel="Responder"
              placeholder="Escribe tu respuesta..."
            />
          </div>
        )}

        {/* Replies */}
        {showReplies && showLocalReplies && comment.replyCount > 0 && (
          <CommentReplies parentId={comment.id} level={level + 1} />
        )}
      </CardContent>
    </Card>
  )
}