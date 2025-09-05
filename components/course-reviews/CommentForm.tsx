import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { X, Send } from "lucide-react"

interface CommentFormProps {
  newComment: string
  setNewComment: (comment: string) => void
  replyingTo: string | null
  setReplyingTo: (id: string | null) => void
  onSubmit: () => Promise<void>
  isCreating: boolean
  isAuthenticated: boolean
  user: any
  allComments?: any[]
}

export function CommentForm({
  newComment,
  setNewComment,
  replyingTo,
  setReplyingTo,
  onSubmit,
  isCreating,
  isAuthenticated,
  user,
  allComments = []
}: CommentFormProps) {
  const handleSubmit = async () => {
    if (!newComment.trim()) return
    await onSubmit()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const replyingToComment = replyingTo 
    ? allComments.find(c => c.id === replyingTo) 
    : null

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Inicia sesión para dejar un comentario
            </p>
            <Button variant="outline">
              Iniciar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {/* Reply indicator */}
        {replyingTo && replyingToComment && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600">Respondiendo a </span>
                <span className="font-medium">
                  {replyingToComment.userName || 'Usuario'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
                className="h-auto p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {replyingToComment.content}
            </p>
          </div>
        )}

        <div className="flex gap-3 sm:gap-4">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
            <AvatarImage 
              src={user?.avatar} 
              alt={user?.name || user?.email || 'Usuario'} 
            />
            <AvatarFallback className="text-xs sm:text-sm">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea
              placeholder={replyingTo 
                ? "Escribe tu respuesta..." 
                : "Comparte tu experiencia con este curso..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyPress}
              className="resize-none min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
              disabled={isCreating}
            />
            
            <div className="flex justify-between items-center mt-3 gap-2">
              <p className="text-xs text-gray-500">
                Tip: Usa Cmd/Ctrl + Enter para enviar
              </p>
              
              <div className="flex gap-2">
                {replyingTo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                    disabled={isCreating}
                  >
                    Cancelar
                  </Button>
                )}
                
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!newComment.trim() || isCreating}
                  className="min-w-[100px]"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-3 w-3" />
                      <span>{replyingTo ? 'Responder' : 'Comentar'}</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}