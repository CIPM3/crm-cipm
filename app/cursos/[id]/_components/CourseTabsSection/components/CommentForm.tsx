import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface CommentFormProps {
  onSubmit: (content: string, rating?: number) => Promise<void>
  isSubmitting?: boolean
  placeholder?: string
  showRating?: boolean
  autoFocus?: boolean
}

export default function CommentForm({
  onSubmit,
  isSubmitting = false,
  placeholder = "Comparte tu opinión sobre este curso...",
  showRating = true,
  autoFocus = false
}: CommentFormProps) {
  const [content, setContent] = useState("")
  const [rating, setRating] = useState<number>(5)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  const handleSubmit = async () => {
    if (!content.trim()) return
    
    try {
      await onSubmit(content, showRating ? rating : undefined)
      setContent("")
      setRating(5)
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {showRating && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-colors duration-150"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                  >
                    <Star
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${
                        star <= (hoveredRating ?? rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({rating} de 5)
                </span>
              </div>
            </div>
          )}

          <div>
            <Textarea
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
              autoFocus={autoFocus}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Enviando..." : showRating ? "Publicar Opinión" : "Responder"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}