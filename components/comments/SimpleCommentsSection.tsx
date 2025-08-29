// Simplified Comments Component for Testing
"use client"

import { useState } from "react"
import { MessageCircle, Heart, Reply } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGetCourseComments, useCommentInteractions } from "@/hooks/queries"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface SimpleCommentsSectionProps {
  courseId: string
}

export default function SimpleCommentsSection({ courseId }: SimpleCommentsSectionProps) {
  const { user } = useAuthStore()
  const [newComment, setNewComment] = useState("")

  // Fetch comments
  const { 
    data: comments = [], 
    isLoading, 
    error 
  } = useGetCourseComments(courseId, { topLevelOnly: true })

  // Comment interactions
  const {
    createComment,
    toggleLike,
    isCreating
  } = useCommentInteractions()

  const handleCreateComment = async () => {
    if (!user || !newComment.trim()) return

    try {
      await createComment({
        courseId,
        content: newComment.trim(),
        parentId: null,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        userAvatar: user.avatar
      })
      
      setNewComment("")
    } catch (error) {
      console.error('Error creating comment:', error)
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar comentarios</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-semibold">
          Comentarios ({comments.length})
        </h3>
      </div>

      {/* Create Comment Form */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Escribe tu comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateComment}
                  disabled={!newComment.trim() || isCreating}
                >
                  {isCreating ? 'Enviando...' : 'Enviar comentario'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No hay comentarios aún</p>
            <p className="text-sm text-gray-400">Sé el primero en comentar</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Comment Header */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>
                        {comment.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{comment.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {comment.createdAt && formatDistanceToNow(
                          new Date(comment.createdAt.seconds * 1000), 
                          { addSuffix: true, locale: es }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <p className="text-gray-700">{comment.content}</p>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-gray-100 ${
                        comment.likedBy?.includes(user?.id || '') 
                          ? 'text-red-600' 
                          : 'text-gray-500'
                      }`}
                      disabled={!user}
                    >
                      <Heart className="h-4 w-4" />
                      {comment.likes || 0}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}