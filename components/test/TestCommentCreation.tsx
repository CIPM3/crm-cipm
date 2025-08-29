"use client"

import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useCommentInteractions } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TestCommentCreationProps {
  courseId: string
}

export default function TestCommentCreation({ courseId }: TestCommentCreationProps) {
  const { user } = useAuthStore()
  const [testComment, setTestComment] = useState('')
  const [lastResult, setLastResult] = useState<string>('')
  
  const {
    createComment,
    isCreating,
    createError
  } = useCommentInteractions()

  const handleTestComment = async () => {
    if (!user || !testComment.trim()) {
      setLastResult('❌ No user logged in or empty comment')
      return
    }

    try {
      console.log('=== TESTING COMMENT CREATION ===')
      console.log('Course ID:', courseId)
      console.log('User:', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      })
      console.log('Comment content:', testComment)

      const result = await createComment({
        courseId,
        content: testComment.trim(),
        parentId: null,
        userId: user.id,
        userName: user.name || user.email || 'Test User',
        userRole: user.role || 'cliente',
        userAvatar: user.avatar
      })

      console.log('Comment creation result:', result)
      setLastResult('✅ Comment created successfully!')
      setTestComment('')
    } catch (error: any) {
      console.error('=== COMMENT CREATION ERROR ===', error)
      setLastResult(`❌ Error: ${error.message || error}`)
    }
  }

  return (
    <Card className="mb-6 border-dashed border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-600">🧪 Test Comment Creation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!user && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            ⚠️ You need to be logged in to test comment creation
          </div>
        )}
        
        {user && (
          <>
            <div className="text-sm text-gray-600">
              <p><strong>User:</strong> {user.name || user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Course ID:</strong> {courseId}</p>
            </div>
            
            <Textarea
              value={testComment}
              onChange={(e) => setTestComment(e.target.value)}
              placeholder="Enter test comment..."
              className="min-h-[80px]"
            />
            
            <Button
              onClick={handleTestComment}
              disabled={!testComment.trim() || isCreating}
              className="w-full"
            >
              {isCreating ? 'Creating Comment...' : 'Test Create Comment'}
            </Button>
            
            {lastResult && (
              <div className={`p-3 rounded ${
                lastResult.startsWith('✅') 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {lastResult}
              </div>
            )}
            
            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
                <strong>TanStack Query Error:</strong> {createError.message}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}