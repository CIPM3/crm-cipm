import { CourseComment } from "@/types"
import { CommentCard } from "./CommentCard"
import { EmptyCommentsState } from "./CommentStates"

interface CommentsListProps {
  comments: (CourseComment & { replies?: CourseComment[], replyCount?: number })[]
  currentUserId?: string
  canModerate?: boolean
  onLike: (commentId: string) => void
  onReply: (commentId: string) => void
  onEdit: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  onPin?: (commentId: string, isPinned: boolean) => void
}

export function CommentsList({
  comments,
  currentUserId,
  canModerate,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onPin
}: CommentsListProps) {
  if (!comments.length) {
    return <EmptyCommentsState />
  }

  // Sort comments: pinned first, then by creation date (newest first)
  const sortedComments = [...comments].sort((a, b) => {
    // Pinned comments first
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    
    // Then by creation date (newest first)
    return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold">
        Comentarios ({comments.length})
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {sortedComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            canModerate={canModerate}
            onLike={onLike}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            onPin={onPin}
          />
        ))}
      </div>
    </div>
  )
}