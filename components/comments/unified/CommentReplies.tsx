"use client"

import { useGetCommentReplies } from '@/hooks/comments/queries'
import CommentItem from './CommentItem'
import { Loader2 } from 'lucide-react'

interface CommentRepliesProps {
  parentId: string
  level: number
}

export default function CommentReplies({ parentId, level }: CommentRepliesProps) {
  const { 
    data: replies = [], 
    isLoading, 
    error 
  } = useGetCommentReplies(parentId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">
          Cargando respuestas...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4 text-destructive text-sm">
        Error al cargar las respuestas
      </div>
    )
  }

  if (replies.length === 0) {
    return null
  }

  return (
    <div className="mt-4">
      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          level={level}
          showReplies={level < 2} // Limit nesting to 2 levels
        />
      ))}
    </div>
  )
}