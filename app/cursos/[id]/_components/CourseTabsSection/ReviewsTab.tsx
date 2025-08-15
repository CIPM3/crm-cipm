import { Course } from "@/types"
import { Star } from "lucide-react"

interface ReviewsTabProps {
  course: Course
}

interface Review {
  id: number
  userName: string
  timeAgo: string
  rating: number
  comment: string
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1,
    userName: "Usuario Ejemplo 1",
    timeAgo: "hace 1 semana",
    rating: 5,
    comment: "Este curso superó todas mis expectativas. El contenido está muy bien estructurado y los instructores explican los conceptos de manera clara y concisa. Recomendaría este curso a cualquier persona interesada en mejorar sus habilidades de gestión de proyectos."
  },
  {
    id: 2,
    userName: "Usuario Ejemplo 2",
    timeAgo: "hace 2 semanas",
    rating: 5,
    comment: "Excelente curso, muy práctico y con ejemplos reales. Los módulos están bien organizados y el contenido es de alta calidad."
  },
  {
    id: 3,
    userName: "Usuario Ejemplo 3",
    timeAgo: "hace 3 semanas",
    rating: 5,
    comment: "Me gustó mucho la metodología utilizada. Los instructores son muy profesionales y el material de apoyo es excelente."
  }
]

const RATING_DISTRIBUTION = [
  { stars: 5, percentage: 70 },
  { stars: 4, percentage: 20 },
  { stars: 3, percentage: 7 },
  { stars: 2, percentage: 2 },
  { stars: 1, percentage: 1 }
]

export default function ReviewsTab({ course }: ReviewsTabProps) {
  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold">{course.rating}</div>
          <div className="flex items-center justify-center md:justify-start mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(course.rating) 
                    ? "fill-yellow-500 text-yellow-500" 
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-muted-foreground mt-1">
            Basado en {SAMPLE_REVIEWS.length} valoraciones
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2 w-full max-w-md">
          {RATING_DISTRIBUTION.map(({ stars, percentage }) => (
            <RatingBar
              key={stars}
              stars={stars}
              percentage={percentage}
            />
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Opiniones de los estudiantes</h2>
        <div className="space-y-6">
          {SAMPLE_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  )
}

interface RatingBarProps {
  stars: number
  percentage: number
}

function RatingBar({ stars, percentage }: RatingBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 w-12">
        <span>{stars}</span>
        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      </div>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-yellow-500 rounded-full transition-all duration-300" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-10">
        {percentage}%
      </span>
    </div>
  )
}

interface ReviewCardProps {
  review: Review
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-start gap-4 mb-4">
        {/* User Avatar */}
        <div className="rounded-full bg-gray-200 h-12 w-12 flex items-center justify-center text-lg font-bold text-gray-500 flex-shrink-0">
          {review.userName[0]}
        </div>
        
        {/* User Info and Rating */}
        <div className="flex-1">
          <h3 className="font-bold">{review.userName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  className={`h-4 w-4 ${
                    j < review.rating 
                      ? "fill-yellow-500 text-yellow-500" 
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {review.timeAgo}
            </span>
          </div>
        </div>
      </div>
      
      {/* Review Text */}
      <p className="text-muted-foreground leading-relaxed">
        {review.comment}
      </p>
    </div>
  )
}