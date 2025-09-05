import { fetchItems, fetchItem, addItem, updateItem, deleteItem, QueryOptions, FirebaseServiceError } from './base/firebase-base'
import { CourseComment, CommentsQueryOptions } from '@/types'
import { COLLECTIONS } from '@/lib/constants'

// === COMMENT DATA OPERATIONS ===

export const getAllCommentsForCourse = (courseId: string) =>
  fetchItems<CourseComment>(COLLECTIONS.COURSE_COMMENTS, {
    where: [{ field: 'courseId', operator: '==', value: courseId }],
    orderBy: [{ field: 'createdAt', direction: 'desc' }]
  })

export const getTopLevelCommentsForCourse = (courseId: string, limit?: number) =>
  fetchItems<CourseComment>(COLLECTIONS.COURSE_COMMENTS, {
    where: [
      { field: 'courseId', operator: '==', value: courseId },
      { field: 'parentId', operator: '==', value: null }
    ],
    orderBy: [{ field: 'createdAt', direction: 'desc' }],
    limit
  })

export const getRepliesForComment = (parentId: string, limit?: number) =>
  fetchItems<CourseComment>(COLLECTIONS.COURSE_COMMENTS, {
    where: [{ field: 'parentId', operator: '==', value: parentId }],
    orderBy: [{ field: 'createdAt', direction: 'asc' }], // Replies oldest first
    limit
  })

export const getCommentsByUser = (userId: string, courseId?: string) => {
  const whereConditions = [{ field: 'userId', operator: '==', value: userId }]
  if (courseId) {
    whereConditions.push({ field: 'courseId', operator: '==', value: courseId })
  }
  
  return fetchItems<CourseComment>(COLLECTIONS.COURSE_COMMENTS, {
    where: whereConditions,
    orderBy: [{ field: 'createdAt', direction: 'desc' }]
  })
}

export const getPinnedCommentsForCourse = (courseId: string) =>
  fetchItems<CourseComment>(COLLECTIONS.COURSE_COMMENTS, {
    where: [
      { field: 'courseId', operator: '==', value: courseId },
      { field: 'isPinned', operator: '==', value: true }
    ],
    orderBy: [{ field: 'createdAt', direction: 'desc' }]
  })

export const getCommentById = (id: string) => 
  fetchItem<CourseComment>(COLLECTIONS.COURSE_COMMENTS, id)

// === COMMENT CRUD OPERATIONS ===

export const createCourseComment = (data: Omit<CourseComment, 'id' | 'createdAt' | 'updatedAt'>) => 
  addItem<CourseComment>(COLLECTIONS.COURSE_COMMENTS, {
    ...data,
    likes: 0,
    likedBy: [],
    isPinned: false,
    isModerated: false
  })

export const updateCourseComment = (id: string, data: Partial<CourseComment>) => 
  updateItem<CourseComment>(COLLECTIONS.COURSE_COMMENTS, id, data)

export const deleteCourseComment = (id: string) => 
  deleteItem(COLLECTIONS.COURSE_COMMENTS, id)

// === ADVANCED COMMENT QUERIES ===

export const queryComments = async (options: CommentsQueryOptions) => {
  const whereConditions: { field: string; operator: any; value: any }[] = []
  
  if (options.courseId) {
    whereConditions.push({ field: 'courseId', operator: '==', value: options.courseId })
  }
  
  if (options.userId) {
    whereConditions.push({ field: 'userId', operator: '==', value: options.userId })
  }
  
  if (options.parentId !== undefined) {
    whereConditions.push({ field: 'parentId', operator: '==', value: options.parentId })
  }
  
  if (options.isPinned !== undefined) {
    whereConditions.push({ field: 'isPinned', operator: '==', value: options.isPinned })
  }

  const orderByField = options.orderBy || 'createdAt'
  const orderDirection = options.order || 'desc'

  return fetchItems<CourseComment>(COLLECTIONS.COURSE_COMMENTS, {
    where: whereConditions,
    orderBy: [{ field: orderByField, direction: orderDirection }],
    limit: options.limit
  })
}

// === COMMENT STATISTICS ===

export const getCommentStats = async (courseId: string) => {
  try {
    const allComments = await getAllCommentsForCourse(courseId)
    
    const totalComments = allComments.length
    const totalReplies = allComments.filter(c => c.parentId).length
    const topLevelComments = totalComments - totalReplies
    const totalLikes = allComments.reduce((sum, comment) => sum + (comment.likes || 0), 0)
    const pinnedComments = allComments.filter(c => c.isPinned).length
    const moderatedComments = allComments.filter(c => c.isModerated).length

    return {
      totalComments: topLevelComments, // Only count top-level comments
      totalReplies,
      totalInteractions: totalComments,
      totalLikes,
      pinnedComments,
      moderatedComments,
      averageLikesPerComment: totalComments > 0 ? totalLikes / totalComments : 0
    }
  } catch (error: any) {
    console.error('Error fetching comment stats:', error)
    throw new FirebaseServiceError(
      'Failed to fetch comment statistics',
      error.code || 'unknown',
      'getCommentStats',
      COLLECTIONS.COURSE_COMMENTS
    )
  }
}

// === COMMENT INTERACTIONS ===

export const toggleCommentLike = async (commentId: string, userId: string): Promise<{ hasLiked: boolean; newLikeCount: number }> => {
  try {
    const comment = await getCommentById(commentId)
    const likedBy = comment.likedBy || []
    
    const hasLiked = likedBy.includes(userId)
    
    if (hasLiked) {
      // Unlike: remove user from likedBy array and decrease likes count
      const updatedLikedBy = likedBy.filter(id => id !== userId)
      const newLikeCount = Math.max(0, (comment.likes || 0) - 1)
      
      await updateCourseComment(commentId, {
        likedBy: updatedLikedBy,
        likes: newLikeCount
      })
      
      return { hasLiked: false, newLikeCount }
    } else {
      // Like: add user to likedBy array and increase likes count
      const updatedLikedBy = [...likedBy, userId]
      const newLikeCount = (comment.likes || 0) + 1
      
      await updateCourseComment(commentId, {
        likedBy: updatedLikedBy,
        likes: newLikeCount
      })
      
      return { hasLiked: true, newLikeCount }
    }
  } catch (error: any) {
    console.error(`Error toggling like for comment "${commentId}":`, error)
    throw new FirebaseServiceError(
      'Failed to toggle like on comment',
      error.code || 'unknown',
      'toggleCommentLike',
      COLLECTIONS.COURSE_COMMENTS
    )
  }
}

export const toggleCommentPin = async (commentId: string, isPinned: boolean): Promise<void> => {
  try {
    await updateCourseComment(commentId, { isPinned })
  } catch (error: any) {
    console.error(`Error toggling pin for comment "${commentId}":`, error)
    throw new FirebaseServiceError(
      'Failed to toggle pin on comment',
      error.code || 'unknown',
      'toggleCommentPin',
      COLLECTIONS.COURSE_COMMENTS
    )
  }
}

export const toggleCommentModeration = async (commentId: string, isModerated: boolean): Promise<void> => {
  try {
    await updateCourseComment(commentId, { isModerated })
  } catch (error: any) {
    console.error(`Error toggling moderation for comment "${commentId}":`, error)
    throw new FirebaseServiceError(
      'Failed to toggle moderation on comment',
      error.code || 'unknown',
      'toggleCommentModeration',
      COLLECTIONS.COURSE_COMMENTS
    )
  }
}

// === COMMENT PERMISSIONS & VALIDATION ===

export const canModerateComments = (userRole: string): boolean => {
  return ['admin', 'instructor'].includes(userRole)
}

export const canPinComments = (userRole: string): boolean => {
  return ['admin', 'instructor'].includes(userRole)
}

export const canEditComment = (comment: CourseComment, userId: string, userRole: string): boolean => {
  // User can edit their own comments or if they're a moderator
  return comment.userId === userId || canModerateComments(userRole)
}

export const canDeleteComment = (comment: CourseComment, userId: string, userRole: string): boolean => {
  // User can delete their own comments or if they're a moderator
  return comment.userId === userId || canModerateComments(userRole)
}

export const validateCommentContent = (content: string): string[] => {
  const errors: string[] = []
  
  if (!content?.trim()) {
    errors.push('El contenido del comentario no puede estar vacío')
  }
  
  if (content.length > 2000) {
    errors.push('El comentario no puede exceder 2000 caracteres')
  }
  
  // Basic spam detection
  const spamPatterns = [
    /(.)\1{10,}/, // Repeated characters
    /^[A-Z\s!]{20,}$/, // All caps
  ]
  
  const hasSpam = spamPatterns.some(pattern => pattern.test(content))
  if (hasSpam) {
    errors.push('El contenido parece spam. Por favor, revisa tu comentario.')
  }
  
  return errors
}

// === COMMENT UTILITIES ===

export const getCommentDepth = async (commentId: string): Promise<number> => {
  try {
    const comment = await getCommentById(commentId)
    if (!comment.parentId) return 0
    
    const parentDepth = await getCommentDepth(comment.parentId)
    return parentDepth + 1
  } catch (error) {
    return 0
  }
}

export const formatCommentContent = (content: string, maxLength: number = 150): string => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength).trim() + '...'
}