"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useComments } from './CommentsProvider'

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  onCancel?: () => void
  initialContent?: string
  placeholder?: string
  submitLabel?: string
  showCancel?: boolean
}

export default function CommentForm({
  onSubmit,
  onCancel,
  initialContent = '',
  placeholder = 'Escribe tu comentario...',
  submitLabel = 'Comentar',
  showCancel = true
}: CommentFormProps) {
  const { permissions } = useComments()
  const [content, setContent] = useState(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(content.trim())
      setContent('')
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setContent(initialContent)
    onCancel?.()
  }

  if (!permissions.canComment) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Debes iniciar sesión para comentar
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        disabled={isSubmitting}
        className="resize-none"
      />
      
      <div className="flex items-center space-x-2">
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          size="sm"
        >
          {isSubmitting ? 'Enviando...' : submitLabel}
        </Button>
        
        {showCancel && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            size="sm"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}