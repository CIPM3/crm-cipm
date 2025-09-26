// This file has been refactored and modularized for better maintainability
// All functionality has been moved to the /hooks/comments/ directory

// Re-export all comment-related hooks for backward compatibility
export * from '../comments/queries'
export * from '../comments/mutations'
export * from '../comments/interactions'
export * from '../comments/observer'

// Legacy exports - these are the original exports from this file
// All query hooks are already exported via export * above

// All mutation hooks are already exported via export * above

// Interactions hooks are already exported via export * above