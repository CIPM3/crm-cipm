import { MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function CommentsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export function EmptyCommentsState() {
  return (
    <div className="text-center py-12">
      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No hay comentarios aún
      </h3>
      <p className="text-gray-500 mb-4">
        Sé el primero en compartir tu experiencia con este curso
      </p>
      <p className="text-sm text-gray-400">
        Los comentarios ayudan a otros estudiantes a decidirse
      </p>
    </div>
  )
}

interface CommentsErrorStateProps {
  error: Error
}

export function CommentsErrorState({ error }: CommentsErrorStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-red-600 mb-2">Error al cargar comentarios</p>
      <p className="text-sm text-gray-500">{error.message}</p>
    </div>
  )
}