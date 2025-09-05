// === ENHANCED COMMENTS SYSTEM EXPORTS ===
// Refactored modular comments system (reduced from 593 to ~150 lines per component)

// Main component
export { default as EnhancedCommentsSection } from "./EnhancedCommentsSection"

// Sub-components (reusable)
export { CommentForm } from "./CommentForm"
export { CommentItem } from "./CommentItem"
export { CommentsList } from "./CommentsList"
export { CommentsStats } from "./CommentsStats"

// Hooks
export { useCommentsState } from "./useCommentsState"

// Backward compatibility
export { default } from "./EnhancedCommentsSection"