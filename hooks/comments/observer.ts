import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { onSnapshot, collection, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { queryKeys } from '@/lib/queryKeys'

/**
 * Real-time comment observer hook
 * Sets up Firebase listener to invalidate queries when comments change
 */
export const useCommentsObserver = (courseId: string, contentId?: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    // For standalone videos, we observe using contentId instead of courseId
    const isStandaloneVideo = !courseId || courseId === ''
    
    if (!courseId && !contentId) return

    // Create Firebase query
    const commentsRef = collection(db, 'CourseComments')
    const q = isStandaloneVideo && contentId
      ? query(commentsRef, where('contentId', '==', contentId), where('commentType', '==', 'video'))
      : query(commentsRef, where('courseId', '==', courseId))

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Invalidate appropriate queries to trigger refetch
      if (isStandaloneVideo && contentId) {
        queryClient.invalidateQueries({ 
          queryKey: ['comentarios', 'standalone-video', contentId]
        })
      } else {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.comentariosByCurso(courseId) 
        })
      }
    })

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [courseId, contentId, queryClient])
}