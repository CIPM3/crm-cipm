// === INDIVIDUAL COMMENT COMPONENT ===
// Displays a single comment with actions and replies

import React from "react"
import { Heart, Reply, MoreVertical, Pin, Flag, Edit, Trash2 } from "lucide-react"
import { CourseComment } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"

interface CommentItemProps {
  comment: CourseComment
  
  // Permissions
  canLike?: boolean
  canReply?: boolean
  canEdit?: boolean
  canDelete?: boolean
  canPin?: boolean
  canModerate?: boolean
  
  // States
  isLiked?: boolean
  isEditing?: boolean
  
  // Actions
  onLike?: () => void
  onReply?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onPin?: () => void
  onModerate?: () => void
  
  // Styling
  className?: string
  isReply?: boolean
  showActions?: boolean
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  canLike = true,
  canReply = true,
  canEdit = false,
  canDelete = false,
  canPin = false,
  canModerate = false,
  isLiked = false,
  isEditing = false,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onPin,
  onModerate,
  className,
  isReply = false,
  showActions = true
}) => {
  const getDate = (timestamp: any): Date => {
    if (timestamp?.toDate) {
      return timestamp.toDate()
    }
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000)
    }
    return new Date(timestamp)
  }

  const timeAgo = formatDistanceToNow(getDate(comment.createdAt), {
    addSuffix: true,
    locale: es
  })

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'develop':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'instructor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'formacion de grupo':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isReply && "ml-8 mt-2",
      comment.isPinned && "ring-2 ring-blue-200 dark:ring-blue-800",
      comment.isModerated && "opacity-60",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className={cn(
            "shrink-0",
            isReply ? "h-7 w-7" : "h-9 w-9"
          )}>
            <AvatarImage src={comment.userAvatar} />
            <AvatarFallback>
              {comment.userName?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">
                  {comment.userName}
                </span>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", getRoleColor(comment.userRole))}
                >
                  {comment.userRole}
                </Badge>
                {comment.isPinned && (
                  <Badge variant="outline" className="text-xs">
                    <Pin className="h-3 w-3 mr-1" />
                    Fijado
                  </Badge>
                )}
                {comment.isEdited && (
                  <span className="text-xs text-muted-foreground">
                    (editado)
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {timeAgo}
                </span>
                
                {showActions && (canEdit || canDelete || canPin || canModerate) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Más acciones</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canEdit && (
                        <DropdownMenuItem onClick={onEdit}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      )}
                      {canPin && (
                        <DropdownMenuItem onClick={onPin}>
                          <Pin className="h-4 w-4 mr-2" />
                          {comment.isPinned ? 'Desfijar' : 'Fijar'}
                        </DropdownMenuItem>
                      )}
                      {canModerate && (
                        <DropdownMenuItem onClick={onModerate}>
                          <Flag className="h-4 w-4 mr-2" />
                          {comment.isModerated ? 'Desmoderar' : 'Moderar'}
                        </DropdownMenuItem>
                      )}
                      {(canEdit || canPin || canModerate) && canDelete && (
                        <DropdownMenuSeparator />
                      )}
                      {canDelete && (
                        <DropdownMenuItem 
                          onClick={onDelete}
                          className="text-destructive focus:text-destructive"
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
            
            {/* Content */}
            <div className="text-sm text-foreground mb-3 whitespace-pre-wrap">
              {comment.content}
            </div>
            
            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-4">
                {canLike && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLike}
                    className={cn(
                      "h-8 gap-1 text-xs",
                      isLiked && "text-red-500 hover:text-red-600"
                    )}
                  >
                    <Heart className={cn(
                      "h-4 w-4",
                      isLiked && "fill-current"
                    )} />
                    {comment.likes || 0}
                  </Button>
                )}
                
                {canReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReply}
                    className="h-8 gap-1 text-xs"
                  >
                    <Reply className="h-4 w-4" />
                    Responder
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}