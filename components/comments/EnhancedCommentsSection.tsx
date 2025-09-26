// components/comments/EnhancedCommentsSection.tsx - Enhanced Comments System Integration
"use client"

import UnifiedComments from "./unified"

interface EnhancedCommentsSectionProps {
  courseId: string
  maxInitialComments?: number
  allowReplies?: boolean
  showStats?: boolean
}

export default function EnhancedCommentsSection({ 
  courseId, 
  maxInitialComments = 10,
  allowReplies = true,
  showStats = true
}: EnhancedCommentsSectionProps) {
  return (
    <UnifiedComments
      contextType="course"
      contextId={courseId}
      allowReplies={allowReplies}
      showStats={showStats}
      enableModeration={true}
      maxInitialComments={maxInitialComments}
      emptyStateMessage="No hay comentarios aún. ¡Comparte tu opinión sobre este curso!"
    />
  )
}