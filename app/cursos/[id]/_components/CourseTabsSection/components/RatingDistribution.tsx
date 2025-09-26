import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface RatingDistribution {
  rating: number
  count: number
  percentage: number
}

interface RatingDistributionProps {
  distribution: RatingDistribution[]
  averageRating: number
  totalComments: number
}

export default function RatingDistribution({ 
  distribution, 
  averageRating, 
  totalComments 
}: RatingDistributionProps) {
  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Basado en {totalComments} opiniones
            </p>
          </div>

          <div className="space-y-1 w-full sm:w-64">
            {distribution.map((item) => (
              <div key={item.rating} className="flex items-center space-x-2 text-sm">
                <span className="w-6 text-right">{item.rating}</span>
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-600">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}