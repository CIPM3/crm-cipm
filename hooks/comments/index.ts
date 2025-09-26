// Re-export all comment-related hooks from a single entry point
export * from './queries'
export * from './mutations'
export * from './interactions'
export * from './observer'

// For backward compatibility, export the most commonly used hooks
export { useGetCourseComments, useGetVideoComments, useGetStandaloneVideoComments } from './queries'
export { useCommentInteractions } from './interactions'
export { useCommentsObserver } from './observer'