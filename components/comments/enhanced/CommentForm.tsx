// === COMMENT FORM COMPONENT ===
// Reusable form for creating and editing comments

import React from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface CommentFormProps {
  // Content
  value: string
  onChange: (value: string) => void
  placeholder?: string
  
  // Actions
  onSubmit: () => void
  onCancel?: () => void
  
  // States
  isSubmitting?: boolean
  isReply?: boolean
  isEdit?: boolean
  
  // User info
  userAvatar?: string
  userName?: string
  
  // Styling
  className?: string
  compact?: boolean
}

export const CommentForm: React.FC<CommentFormProps> = ({
  value,
  onChange,
  placeholder = "Escribe tu comentario...",
  onSubmit,
  onCancel,
  isSubmitting = false,
  isReply = false,
  isEdit = false,
  userAvatar,
  userName,
  className,
  compact = false
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !isSubmitting) {
      onSubmit()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        {!compact && !isEdit && (
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 space-y-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={isReply || compact ? 2 : 3}
            className="resize-none"
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {isReply ? "Respondiendo..." : isEdit ? "Editando..." : ""}
              {!compact && <span className="ml-2">Ctrl/Cmd + Enter para enviar</span>}
            </div>
            <div className="flex items-center gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={!value.trim() || isSubmitting}
                className="min-w-20"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    {isEdit ? "Guardar" : isReply ? "Responder" : "Comentar"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )

  if (isReply || isEdit) {
    return (
      <Card className={cn("mt-2", className)}>
        <CardContent className="p-4">
          {formContent}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {formContent}
    </div>
  )
}