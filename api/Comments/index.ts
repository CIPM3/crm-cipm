import { 
  CourseComment, 
  CreateCommentData, 
  UpdateCommentData,
  CommentWithReplies,
  CommentsQueryOptions
} from "@/types"
import { 
  fetchItems, 
  fetchItem, 
  addItem, 
  updateItem, 
  deleteItem,
  queryItems,
  batchUpdateItems,
  incrementField,
  getAllCourseComments,
  getTopLevelComments,
  getCommentReplies,
  getUserComments,
  getPinnedComments,
  getCommentsByCourse,
  getCommentById as getCommentByIdFromService,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  pinComment,
  moderateComment
} from "@/lib/firebaseService"
import { COLLECTIONS, UserRole } from "@/lib/constants"
import { Timestamp, where, orderBy, limit as fbLimit, WhereFilterOp } from "firebase/firestore"

const collectionName = COLLECTIONS.COURSE_COMMENTS

// === BASIC CRUD OPERATIONS ===

/**
 * Get all comments for a specific course
 */
export const getAllCommentsForCourse = async (courseId: string) => {
  console.log('🔍 API: Getting comments for course:', courseId)
  
  // Get all comments and filter by courseId to ensure we get results
  const allComments = await fetchItems<CourseComment>('CourseComments')
  console.log('📊 API: Total comments in DB:', allComments.length)
  
  const filtered = allComments.filter(comment => comment.courseId === courseId)
  console.log('🎯 API: Filtered comments for course:', filtered.length)
  
  return filtered
}

/**
 * Get a single comment by ID
 */
export const getCommentById = (id: string) => 
  getCommentByIdFromService(id)

/**
 * Create a new comment
 */
export const createCourseComment = async (data: CreateCommentData, userId: string, userName: string, userRole: string, userAvatar?: string) => {
  try {
    console.log('=== CREATING COURSE COMMENT ===')
    console.log('Input data:', { data, userId, userName, userRole, userAvatar })
    
    // Validate required fields
    if (!data.courseId) {
      throw new Error('Course ID is required')
    }
    if (!data.content || !data.content.trim()) {
      throw new Error('Comment content is required')
    }
    if (!userId) {
      throw new Error('User ID is required')
    }
    if (!userName) {
      throw new Error('User name is required')
    }
    
    // Don't include timestamps - let addItem handle them automatically
    const commentData: any = {
      courseId: data.courseId,
      userId: userId,
      userName: userName,
      userRole: (userRole || 'cliente') as UserRole,
      content: data.content.trim(),
      parentId: data.parentId || null,
      commentType: data.commentType || 'general',
      contentId: data.contentId || null,
      contentTitle: data.contentTitle || null,
      likes: 0,
      likedBy: [],
      isPinned: false,
      isModerated: false,
      isEdited: false
      // createdAt and updatedAt will be added automatically by addItem
    }
    
    // Only add userAvatar if it exists (Firebase doesn't allow undefined)
    if (userAvatar) {
      commentData.userAvatar = userAvatar
    }
    
    console.log('Final comment data:', commentData)
    console.log('Data types:', {
      courseId: typeof commentData.courseId,
      userId: typeof commentData.userId,
      userName: typeof commentData.userName,
      userRole: typeof commentData.userRole,
      content: typeof commentData.content,
      parentId: commentData.parentId === null ? 'null' : typeof commentData.parentId,
      likes: typeof commentData.likes,
      likedBy: Array.isArray(commentData.likedBy) ? 'array' : typeof commentData.likedBy,
      isPinned: typeof commentData.isPinned,
      isModerated: typeof commentData.isModerated,
      isEdited: typeof commentData.isEdited
    })
    
    const result = await createComment(commentData)
    console.log('✅ Comment created successfully:', result)
    return result
  } catch (error: any) {
    console.error('❌ Error in createCourseComment:', error)
    throw new Error(`Failed to create comment: ${error.message}`)
  }
}

/**
 * Update an existing comment
 */
export const updateCourseComment = async (id: string, data: UpdateCommentData) => {
  const updateData: Partial<CourseComment> = {
    content: data.content,
    isEdited: true,
    updatedAt: Timestamp.now(),
    editedAt: Timestamp.now()
  }
  
  return updateComment(id, updateData)
}

/**
 * Delete a comment
 */
export const deleteCourseComment = (id: string) => 
  deleteComment(id)

// === ADVANCED QUERY OPERATIONS ===

/**
 * Get top-level comments (no parent) for a course with optional limit
 */
export const getTopLevelCommentsForCourse = (courseId: string, limit?: number) => {
  return getTopLevelComments(courseId, limit)
}

/**
 * Get replies for a specific comment
 */
export const getRepliesForComment = (parentId: string, limit?: number) => {
  return getCommentReplies(parentId, limit)
}

/**
 * Get comments by a specific user (optionally filtered by course)
 */
export const getCommentsByUser = (userId: string, courseId?: string) => {
  return getUserComments(userId, courseId)
}

/**
 * Get pinned comments for a course
 */
export const getPinnedCommentsForCourse = (courseId: string) => {
  return getPinnedComments(courseId)
}

/**
 * Get comments with moderation flag
 */
export const getModeratedComments = async (courseId?: string) => {
  const constraints: any[] = [where("isModerated", "==", true)]
  
  if (courseId) {
    constraints.push(where("courseId", "==", courseId))
  }
  
  // Remove orderBy to avoid index requirement, sort in memory instead
  const comments = await queryItems<CourseComment>(collectionName, constraints)
  
  // Sort in memory by creation date (descending)
  return comments.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0
    const bTime = b.createdAt?.seconds || 0
    return bTime - aTime // descending order
  })
}

// === TYPE-SPECIFIC QUERY OPERATIONS ===

/**
 * Get comments by type for a specific course
 */
export const getCommentsByType = async (courseId: string, commentType: 'opinion' | 'video' | 'general'): Promise<CourseComment[]> => {
  const allComments = await queryItems<CourseComment>(collectionName, [
    where("courseId", "==", courseId),
    where("commentType", "==", commentType)
  ])
  
  // Sort in memory by creation date (descending for opinions, ascending for videos)
  return allComments.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0
    const bTime = b.createdAt?.seconds || 0
    // Opinion comments: newest first, Video comments: oldest first
    return commentType === 'opinion' ? bTime - aTime : aTime - bTime
  })
}

/**
 * Get video comments for specific content
 */
export const getVideoComments = async (courseId: string, contentId: string): Promise<CourseComment[]> => {
  const allComments = await queryItems<CourseComment>(collectionName, [
    where("courseId", "==", courseId),
    where("commentType", "==", "video"),
    where("contentId", "==", contentId)
  ])
  
  // Sort in memory by creation date (ascending for chronological order)
  return allComments.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0
    const bTime = b.createdAt?.seconds || 0
    return aTime - bTime
  })
}

/**
 * Get opinion comments for a course
 */
export const getOpinionComments = async (courseId: string): Promise<CourseComment[]> => {
  return getCommentsByType(courseId, 'opinion')
}

// === INTERACTION OPERATIONS ===

/**
 * Toggle like/unlike on a comment
 */
export const toggleCommentLike = async (commentId: string, userId: string): Promise<CourseComment> => {
  const result = await likeComment(commentId, userId)
  // The firebaseService likeComment returns { id }, but we need to fetch the updated comment
  return await getCommentByIdFromService(result.id) as CourseComment
}

/**
 * Toggle pin status on a comment (admin/instructor only)
 */
export const toggleCommentPin = async (commentId: string, isPinned: boolean): Promise<CourseComment> => {
  const result = await pinComment(commentId, isPinned)
  return await getCommentByIdFromService(result.id) as CourseComment
}

/**
 * Toggle moderation status on a comment (admin/instructor only)
 */
export const toggleCommentModeration = async (commentId: string, isModerated: boolean): Promise<CourseComment> => {
  const result = await moderateComment(commentId, isModerated)
  return await getCommentByIdFromService(result.id) as CourseComment
}

// === BULK OPERATIONS ===

/**
 * Get comments with their replies in a nested structure
 */
export const getCommentsWithReplies = async (courseId: string): Promise<CommentWithReplies[]> => {
  // Get all comments for the course (without orderBy to avoid index requirement)
  const allComments = await queryItems<CourseComment>(collectionName, [
    where("courseId", "==", courseId)
  ])
  
  // Sort in memory by creation date
  allComments.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0
    const bTime = b.createdAt?.seconds || 0
    return aTime - bTime
  })
  
  // Separate top-level comments and replies
  const topLevelComments = allComments.filter(comment => !comment.parentId)
  const replies = allComments.filter(comment => comment.parentId)
  
  // Group replies by parent ID
  const repliesByParent: { [key: string]: CourseComment[] } = {}
  replies.forEach(reply => {
    const parentId = reply.parentId!
    if (!repliesByParent[parentId]) {
      repliesByParent[parentId] = []
    }
    repliesByParent[parentId].push(reply)
  })
  
  // Build nested structure
  const commentsWithReplies: CommentWithReplies[] = topLevelComments.map(comment => ({
    ...comment,
    replies: repliesByParent[comment.id] || [],
    replyCount: (repliesByParent[comment.id] || []).length
  }))
  
  // Sort by pinned first, then by creation date
  return commentsWithReplies.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.createdAt.seconds - a.createdAt.seconds
  })
}

/**
 * Get comment statistics for a course
 */
export const getCommentStats = async (courseId: string) => {
  const allComments = await queryItems<CourseComment>(collectionName, [
    where("courseId", "==", courseId)
  ])
  
  const topLevelComments = allComments.filter(comment => !comment.parentId)
  const replies = allComments.filter(comment => comment.parentId)
  const totalLikes = allComments.reduce((sum, comment) => sum + comment.likes, 0)
  const pinnedCount = allComments.filter(comment => comment.isPinned).length
  const moderatedCount = allComments.filter(comment => comment.isModerated).length
  
  return {
    totalComments: topLevelComments.length,
    totalReplies: replies.length,
    totalInteractions: allComments.length,
    totalLikes,
    pinnedComments: pinnedCount,
    moderatedComments: moderatedCount,
    averageLikesPerComment: allComments.length > 0 ? totalLikes / allComments.length : 0
  }
}

/**
 * Bulk moderate multiple comments
 */
export const bulkModerateComments = async (commentIds: string[], isModerated: boolean): Promise<void> => {
  const updates = commentIds.map(id => ({
    id,
    data: { isModerated, updatedAt: Timestamp.now() }
  }))
  
  return batchUpdateItems(collectionName, updates)
}

/**
 * Bulk delete multiple comments and their replies
 */
export const bulkDeleteComments = async (commentIds: string[]): Promise<void> => {
  // Get all replies for the comments to be deleted
  const allReplies: string[] = []
  
  for (const commentId of commentIds) {
    const replies = await queryItems<CourseComment>(collectionName, [
      where("parentId", "==", commentId)
    ])
    allReplies.push(...replies.map(reply => reply.id))
  }
  
  // Delete all comments and their replies
  const allIdsToDelete = [...commentIds, ...allReplies]
  const deletePromises = allIdsToDelete.map(id => deleteItem(collectionName, id))
  
  await Promise.all(deletePromises)
}

// === FLEXIBLE QUERY BUILDER ===

/**
 * Advanced query with multiple filters and options
 * Optimized to reduce Firestore composite index requirements
 */
export const queryComments = async (options: CommentsQueryOptions): Promise<CourseComment[]> => {
  // Use the optimized service function instead of building constraints directly
  return getCommentsByCourse(options)
}

// === HELPER FUNCTIONS ===

/**
 * Check if a user can moderate comments (admin or instructor)
 */
export const canModerateComments = (userRole: string): boolean => {
  return ['admin', 'develop', 'instructor'].includes(userRole.toLowerCase())
}

/**
 * Check if a user can pin comments (admin or instructor)
 */
export const canPinComments = (userRole: string): boolean => {
  return ['admin', 'develop', 'instructor'].includes(userRole.toLowerCase())
}

/**
 * Check if a user can edit a specific comment (own comment or moderator)
 */
export const canEditComment = (comment: CourseComment, userId: string, userRole: string): boolean => {
  return comment.userId === userId || canModerateComments(userRole)
}

/**
 * Check if a user can delete a specific comment (own comment or moderator)
 */
export const canDeleteComment = (comment: CourseComment, userId: string, userRole: string): boolean => {
  return comment.userId === userId || canModerateComments(userRole)
}