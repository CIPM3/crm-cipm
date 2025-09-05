import { Star } from "lucide-react"
import { Course } from "@/types"

interface RatingDistributionItem {
  stars: number
  percentage: number
  count: number
}

interface RatingOverviewProps {
  course: Course
  ratingDistribution: RatingDistributionItem[]
  totalComments: number
}

interface RatingBarProps {
  stars: number
  percentage: number
  count: number
}

function RatingBar({ stars, percentage, count }: RatingBarProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{stars}</span>
        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
      </div>
      
      <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-2.5">
        <div 
          className="bg-yellow-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <span className="text-sm text-muted-foreground w-8 text-right">
        {count}
      </span>
    </div>
  )
}

export function RatingOverview({ course, ratingDistribution, totalComments }: RatingOverviewProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center mb-6 lg:mb-8">
      {/* Overall Rating */}
      <div className="text-center sm:text-left w-full lg:w-auto">
        <div className="text-4xl sm:text-5xl font-bold">{course.rating}</div>
        <div className="flex items-center justify-center sm:justify-start mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                i < Math.floor(course.rating) 
                  ? "fill-yellow-500 text-yellow-500" 
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="text-sm sm:text-base text-muted-foreground mt-1">
          Basado en {totalComments} comentarios
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="flex-1 space-y-2 w-full max-w-md lg:max-w-lg">
        {ratingDistribution.map(({ stars, percentage, count }) => (
          <RatingBar
            key={stars}
            stars={stars}
            percentage={percentage}
            count={count}
          />
        ))}
      </div>
    </div>
  )
}