import UnifiedComments from "@/components/comments/unified"

interface CommentsSectionProps {
  courseId: string
  contentId?: string // Optional: for content-specific comments
  contentTitle?: string // Optional: title of the current content
}

export default function CommentsSection({ courseId, contentId, contentTitle }: CommentsSectionProps) {
  // Determine context type based on props
  const contextType = contentId ? 'video' : 'course'
  const contextId = contentId || courseId
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {contentTitle && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm text-muted-foreground">
            Comentarios para: {contentTitle}
          </h4>
        </div>
      )}
      
      <UnifiedComments
        contextType={contextType}
        contextId={contextId}
        contentId={contentId}
        allowReplies={true}
        showStats={true}
        enableModeration={true}
        maxInitialComments={15}
        emptyStateMessage={
          contentId 
            ? "No hay comentarios para este video aún. ¡Comparte tu opinión!"
            : "No hay comentarios para este curso aún. ¡Sé el primero en comentar!"
        }
      />
    </div>
  )
}