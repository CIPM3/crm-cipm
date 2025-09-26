import UnifiedComments from "@/components/comments/unified"

interface CommentsSectionProps {
  videoId: string
  videoTitle?: string
}

export default function CommentsSection({ videoId, videoTitle }: CommentsSectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {videoTitle && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm text-muted-foreground">
            Comentarios para: {videoTitle}
          </h4>
        </div>
      )}
      
      <UnifiedComments
        contextType="standalone-video"
        contextId={videoId}
        allowReplies={true}
        showStats={true}
        enableModeration={true}
        maxInitialComments={20}
        emptyStateMessage="No hay comentarios para este video aún. ¡Sé el primero en comentar!"
      />
    </div>
  )
}