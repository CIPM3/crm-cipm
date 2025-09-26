"use client"

import CommentsProviderImpl from './CommentsProviderImpl'
import CommentsList from './CommentsList'
import { CommentsProviderProps } from './CommentsProvider'

// Main unified comments component
interface UnifiedCommentsProps extends Omit<CommentsProviderProps, 'children'> {
  showNewCommentForm?: boolean
  emptyStateMessage?: string
  className?: string
}

export default function UnifiedComments(props: UnifiedCommentsProps) {
  const {
    showNewCommentForm = true,
    emptyStateMessage,
    className,
    ...providerProps
  } = props

  return (
    <div className={className}>
      <CommentsProviderImpl {...providerProps}>
        <CommentsList
          showNewCommentForm={showNewCommentForm}
          emptyStateMessage={emptyStateMessage}
        />
      </CommentsProviderImpl>
    </div>
  )
}

// Export individual components for custom layouts
export { default as CommentsProvider } from './CommentsProviderImpl'
export { default as CommentsList } from './CommentsList'
export { default as CommentItem } from './CommentItem'
export { default as CommentForm } from './CommentForm'
export { default as CommentReplies } from './CommentReplies'
export { useComments } from './CommentsProvider'

// Re-export types
export type { CommentsProviderProps } from './CommentsProvider'