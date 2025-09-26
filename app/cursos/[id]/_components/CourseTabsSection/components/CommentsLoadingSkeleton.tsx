import { Card, CardContent } from "@/components/ui/card"

export default function CommentsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Rating Distribution Skeleton */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-12 h-8 bg-gray-200 rounded animate-pulse" />
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            
            <div className="space-y-2 w-full sm:w-64">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-6 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 h-2 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment Form Skeleton */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="w-full h-24 bg-gray-200 rounded animate-pulse" />
            <div className="flex justify-end">
              <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Skeleton */}
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex space-x-4">
                  <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}