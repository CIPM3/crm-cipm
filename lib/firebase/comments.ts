// lib/firebase/comments.ts
import { CourseComment, CommentsQueryOptions } from '@/types'
import { fetchItems, fetchItem, addItem, updateItem, deleteItem, FirebaseServiceError } from './base'

// ===== COURSE COMMENTS =====

// Simplified comments fetching that avoids complex composite indexes
export const getCommentsByCourse = async (options: CommentsQueryOptions): Promise<CourseComment[]> => {
  try {
    // Use the simplest possible query to avoid index requirements
    const queryOptions = {
      where: [] as any[],
      orderBy: [{ field: 'createdAt', direction: 'desc' }] as any[],
      limit: options.limit
    }

    // Only add the most basic filters
    if (options.courseId) {
      queryOptions.where.push({ field: 'courseId', operator: '==', value: options.courseId })
    }

    // Note: parentId filtering is now done client-side for better compatibility
    // This avoids issues with null/undefined values in Firestore queries

    // Fetch all comments with basic query
    let comments = await fetchItems<CourseComment>('CourseComments', queryOptions)

    // Apply additional filters client-side to avoid complex indexes
    if (options.userId) {
      comments = comments.filter(comment => comment.userId === options.userId)
    }

    if (options.isPinned !== undefined) {
      comments = comments.filter(comment => comment.isPinned === options.isPinned)
    }

    // Handle parentId filtering client-side for better compatibility
    if (options.parentId !== undefined) {
      if (options.parentId === null) {
        // Filter for top-level comments (null, undefined, or empty string)
        comments = comments.filter(comment => 
          !comment.parentId || comment.parentId === null || comment.parentId === ''
        )
      } else {
        // Filter for specific parent
        comments = comments.filter(comment => comment.parentId === options.parentId)
      }
    }

    // Sort client-side: pinned first, then by creation date
    comments.sort((a, b) => {
      // Pinned comments first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Then by creation date (newest first) - handle missing timestamps
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })

    // Apply limit after sorting
    if (options.limit) {
      comments = comments.slice(0, options.limit)
    }

    return comments
  } catch (error: any) {
    console.error('Error fetching comments:', error)
    throw new FirebaseServiceError(
      'Failed to fetch comments',
      error.code || 'unknown',
      'getCommentsByCourse',
      'CourseComments'
    )
  }
}

// Get all comments for a course (including replies)
export const getAllCourseComments = (courseId: string) => 
  getCommentsByCourse({ courseId })

// Get top-level comments for a course
export const getTopLevelComments = (courseId: string, limit?: number) => 
  getCommentsByCourse({ courseId, parentId: null, limit })

// Get replies for a specific comment
export const getCommentReplies = (parentId: string, limit?: number) => 
  getCommentsByCourse({ parentId, limit })

// Get comments by user
export const getUserComments = (userId: string, courseId?: string) => 
  getCommentsByCourse({ userId, courseId })

// Get pinned comments for a course
export const getPinnedComments = (courseId: string) => 
  getCommentsByCourse({ courseId, isPinned: true })

// Standard CRUD operations
export const getCommentById = (id: string) => 
  fetchItem<CourseComment>('CourseComments', id)

export const createComment = (data: Omit<CourseComment, 'id' | 'createdAt' | 'updatedAt'>) => 
  addItem<CourseComment>('CourseComments', data)

export const updateComment = (id: string, data: Partial<CourseComment>) => 
  updateItem<CourseComment>('CourseComments', id, data)

export const deleteComment = (id: string) => 
  deleteItem('CourseComments', id)

// Advanced comment operations
export const likeComment = async (commentId: string, userId: string): Promise<{ id: string }> => {
  try {
    const comment = await getCommentById(commentId)
    if (!comment) {
      throw new Error(`Comment with id ${commentId} not found`)
    }
    
    const likedBy = comment.likedBy || []
    
    if (likedBy.includes(userId)) {
      // Unlike: remove user from likedBy array and decrease likes count
      const updatedLikedBy = likedBy.filter(id => id !== userId)
      const updatedData = {
        likedBy: updatedLikedBy,
        likes: Math.max(0, comment.likes - 1)
      }
      return await updateComment(commentId, updatedData)
    } else {
      // Like: add user to likedBy array and increase likes count
      const updatedLikedBy = [...likedBy, userId]
      const updatedData = {
        likedBy: updatedLikedBy,
        likes: comment.likes + 1
      }
      return await updateComment(commentId, updatedData)
    }
  } catch (error: any) {
    console.error(`Error toggling like for comment "${commentId}":`, error)
    throw new FirebaseServiceError(
      'Failed to toggle like on comment',
      error.code || 'unknown',
      'likeComment',
      'CourseComments'
    )
  }
}

export const pinComment = async (commentId: string, isPinned: boolean): Promise<{ id: string }> => {
  try {
    return await updateComment(commentId, { isPinned })
  } catch (error: any) {
    console.error(`Error pinning comment "${commentId}":`, error)
    throw new FirebaseServiceError(
      'Failed to pin comment',
      error.code || 'unknown',
      'pinComment',
      'CourseComments'
    )
  }
}

export const moderateComment = async (commentId: string, isModerated: boolean): Promise<{ id: string }> => {
  try {
    return await updateComment(commentId, { isModerated })
  } catch (error: any) {
    console.error(`Error moderating comment "${commentId}":`, error)
    throw new FirebaseServiceError(
      'Failed to moderate comment',
      error.code || 'unknown',
      'moderateComment',
      'CourseComments'
    )
  }
}