// Simplified Comments Component - now uses unified system
"use client"

import UnifiedComments from "./unified"

interface SimpleCommentsSectionProps {
  courseId: string
}

export default function SimpleCommentsSection({ courseId }: SimpleCommentsSectionProps) {
  return (
    <UnifiedComments
      contextType="course"
      contextId={courseId}
      allowReplies={false}
      showStats={false}
      enableModeration={false}
      maxInitialComments={5}
      emptyStateMessage="No hay comentarios aún. ¡Sé el primero en comentar!"
      className="max-w-2xl"
    />
  )
}