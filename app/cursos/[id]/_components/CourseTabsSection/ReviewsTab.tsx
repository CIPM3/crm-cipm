"use client"
import { Course, CourseComment } from "@/types"
import { MessageCircle, RefreshCw } from "lucide-react"
import { useState, useMemo } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGetOpinionComments, useGetCommentStats, useCommentInteractions, useCommentsObserver } from "@/hooks/queries/useComments"
import { Button } from "@/components/ui/button"
import { ROLES } from "@/lib/constants"

// Import refactored components
import RatingDistribution from "./components/RatingDistribution"
import CommentForm from "./components/CommentForm"
import CommentItem from "./components/CommentItem"
import CommentsLoadingSkeleton from "./components/CommentsLoadingSkeleton"
import DeleteCommentDialog from "./components/DeleteCommentDialog"

interface ReviewsTabProps {
  course: Course
}

export default function ReviewsTab({ course }: ReviewsTabProps) {
  const { user } = useAuthStore()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)

  // Set up real-time observer for comments
  useCommentsObserver(course.id)

  // Fetch data
  const { 
    data: allComments = [], 
    isLoading: loadingComments, 
    error: commentsError,
    refetch: refetchComments
  } = useGetOpinionComments(course.id)
  
  const { data: stats } = useGetCommentStats(course.id)

  // Comment interactions
  const {
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    togglePin,
    toggleModeration,
    isCreating,
    isDeleting
  } = useCommentInteractions()

  // Permission checks
  const canModerate = user?.role === ROLES.ADMIN || user?.role === ROLES.INSTRUCTOR
  const isAuthenticated = !!user

  // Organize comments into nested structure
  const commentsWithReplies = useMemo(() => {
    if (!allComments.length) return []

    const topLevelComments = allComments.filter(comment => !comment.parentId)
    const replies = allComments.filter(comment => comment.parentId)

    const repliesByParent = replies.reduce((acc, reply) => {
      const parentId = reply.parentId!
      if (!acc[parentId]) acc[parentId] = []
      acc[parentId].push(reply)
      return acc
    }, {} as Record<string, CourseComment[]>)

    return topLevelComments.map(comment => ({
      ...comment,
      replies: repliesByParent[comment.id] || []
    }))
  }, [allComments])

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    if (!commentsWithReplies.length) return [
      { rating: 5, count: 0, percentage: 0 },
      { rating: 4, count: 0, percentage: 0 },
      { rating: 3, count: 0, percentage: 0 },
      { rating: 2, count: 0, percentage: 0 },
      { rating: 1, count: 0, percentage: 0 }
    ]

    const totalComments = commentsWithReplies.length
    const ratingCounts = [5, 4, 3, 2, 1].map(rating => {
      const count = commentsWithReplies.filter(c => c.rating === rating).length
      return {
        rating,
        count,
        percentage: totalComments > 0 ? (count / totalComments) * 100 : 0
      }
    })

    return ratingCounts
  }, [commentsWithReplies])

  const averageRating = useMemo(() => {
    if (!commentsWithReplies.length) return 0
    const total = commentsWithReplies.reduce((sum, comment) => sum + (comment.rating || 0), 0)
    return total / commentsWithReplies.length
  }, [commentsWithReplies])

  // Event handlers
  const handleCreateComment = async (content: string, rating?: number) => {
    if (!user) return

    const commentData = {
      content: content.trim(),
      courseId: course.id,
      userId: user.id,
      userName: user.displayName || user.email || 'Usuario',
      userRole: user.role,
      userAvatar: user.photoURL,
      commentType: 'opinion' as const,
      rating: rating || 5,
      parentId: null
    }

    await createComment(commentData)
    refetchComments()
  }

  const handleReply = async (content: string, parentId: string) => {
    if (!user) return

    const replyData = {
      content: content.trim(),
      courseId: course.id,
      userId: user.id,
      userName: user.displayName || user.email || 'Usuario',
      userRole: user.role,
      userAvatar: user.photoURL,
      commentType: 'opinion' as const,
      parentId
    }

    await createComment(replyData)
    refetchComments()
  }

  const handleEdit = async (commentId: string, content: string) => {
    await updateComment({ 
      id: commentId, 
      data: { content: content.trim() },
      courseId: course.id
    })
    refetchComments()
  }

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return

    try {
      await deleteComment({ 
        id: commentToDelete, 
        courseId: course.id,
        hasReplies: false
      })
      setShowDeleteDialog(false)
      setCommentToDelete(null)
      refetchComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleToggleLike = async (commentId: string) => {
    if (!user) return
    await toggleLike({ commentId, userId: user.id, courseId: course.id })
  }

  const handleTogglePin = async (commentId: string, isPinned: boolean) => {
    await togglePin({ commentId, isPinned, courseId: course.id })
    refetchComments()
  }

  const handleToggleModeration = async (commentId: string) => {
    await toggleModeration({ commentId, courseId: course.id })
    refetchComments()
  }

  // Loading state
  if (loadingComments) {
    return <CommentsLoadingSkeleton />
  }

  // Error state
  if (commentsError) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Error al cargar los comentarios</p>
        <Button onClick={() => refetchComments()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Rating Distribution */}
      <RatingDistribution 
        distribution={ratingDistribution}
        averageRating={averageRating}
        totalComments={commentsWithReplies.length}
      />

      {/* Comment Form */}
      {isAuthenticated && (
        <CommentForm 
          onSubmit={handleCreateComment}
          isSubmitting={isCreating}
        />
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {commentsWithReplies.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Sé el primero en dejar una opinión sobre este curso</p>
          </div>
        ) : (
          commentsWithReplies.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={comment.replies}
              currentUserId={user?.id}
              canModerate={canModerate}
              isAuthenticated={isAuthenticated}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDeleteComment}
              onToggleLike={handleToggleLike}
              onTogglePin={handleTogglePin}
              onToggleModeration={handleToggleModeration}
              isSubmitting={isCreating || isDeleting}
            />
          ))
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteCommentDialog 
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setCommentToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}