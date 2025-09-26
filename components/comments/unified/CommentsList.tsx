"use client"

import { MessageCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useComments } from './CommentsProvider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CommentItem from './CommentItem'
import CommentForm from './CommentForm'

interface CommentsListProps {
  showNewCommentForm?: boolean
  emptyStateMessage?: string
}

export default function CommentsList({ 
  showNewCommentForm = true,
  emptyStateMessage = 'No hay comentarios aún. ¡Sé el primero en comentar!'
}: CommentsListProps) {
  const {
    comments,
    isLoading,
    error,
    stats,
    config,
    actions,
    ui,
    permissions
  } = useComments()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-muted-foreground">
          Cargando comentarios...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-destructive">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>Error al cargar los comentarios</span>
      </div>
    )
  }

  const totalComments = comments.length
  const hasMoreComments = stats && stats.total > config.maxInitialComments && !ui.showAllComments

  return (
    <div className="space-y-6">
      {/* Comments Header with Stats */}
      {config.showStats && stats && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Comentarios ({stats.total})
            </h3>
            
            {permissions.canModerate && stats.pending > 0 && (
              <Badge variant="outline" className="text-amber-600">
                {stats.pending} pendientes
              </Badge>
            )}
          </div>
          
          {hasMoreComments && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => ui.setShowAllComments(true)}
            >
              Ver todos ({stats.total})
            </Button>
          )}
        </div>
      )}

      {/* New Comment Form */}
      {showNewCommentForm && permissions.canComment && (
        <div className="border-b pb-6">
          <CommentForm
            onSubmit={async (content) => {
              await actions.createComment({ content })
            }}
            placeholder="Comparte tu opinión sobre este contenido..."
            submitLabel="Publicar comentario"
            showCancel={false}
          />
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {totalComments === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{emptyStateMessage}</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                showReplies={config.allowReplies}
              />
            ))}
            
            {hasMoreComments && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => ui.setShowAllComments(true)}
                >
                  Cargar más comentarios ({stats.total - totalComments} restantes)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}