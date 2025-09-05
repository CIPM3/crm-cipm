// === COMMENTS STATISTICS COMPONENT ===
// Displays comment statistics and metrics

import React from "react"
import { MessageCircle, Heart, Pin, Flag, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface CommentStats {
  totalComments: number
  totalReplies: number
  totalInteractions: number
  totalLikes: number
  pinnedComments: number
  moderatedComments: number
  averageLikesPerComment: number
}

interface CommentsStatsProps {
  stats?: CommentStats
  loading?: boolean
  className?: string
  compact?: boolean
  showDetails?: boolean
}

export const CommentsStats: React.FC<CommentsStatsProps> = ({
  stats,
  loading = false,
  className,
  compact = false,
  showDetails = true
}) => {
  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardContent className={cn("p-4", compact && "p-3")}>
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="text-center">
                <Skeleton className="h-8 w-full mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  const statItems = [
    {
      icon: MessageCircle,
      label: "Comentarios",
      value: stats.totalComments,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Users,
      label: "Respuestas", 
      value: stats.totalReplies,
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: Heart,
      label: "Me gusta",
      value: stats.totalLikes,
      color: "text-red-600 dark:text-red-400"
    },
    {
      icon: Pin,
      label: "Fijados",
      value: stats.pinnedComments,
      color: "text-purple-600 dark:text-purple-400"
    }
  ]

  const additionalStats = showDetails ? [
    {
      label: "Total interacciones",
      value: stats.totalInteractions
    },
    {
      label: "Promedio likes/comentario", 
      value: stats.averageLikesPerComment.toFixed(1)
    }
  ] : []

  return (
    <Card className={cn("", className)}>
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn("font-semibold", compact ? "text-sm" : "text-base")}>
            Estadísticas de Comentarios
          </h3>
          {stats.moderatedComments > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
              <Flag className="h-3 w-3" />
              {stats.moderatedComments} moderado{stats.moderatedComments > 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        <div className={cn(
          "grid gap-3",
          compact ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 lg:grid-cols-4"
        )}>
          {statItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className={cn(
                "flex items-center justify-center mb-1",
                item.color
              )}>
                <item.icon className={cn(
                  "mr-1",
                  compact ? "h-4 w-4" : "h-5 w-5"
                )} />
                <span className={cn(
                  "font-bold",
                  compact ? "text-lg" : "text-xl"
                )}>
                  {item.value}
                </span>
              </div>
              <p className={cn(
                "text-muted-foreground",
                compact ? "text-xs" : "text-sm"
              )}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
        
        {additionalStats.length > 0 && !compact && (
          <>
            <div className="border-t my-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              {additionalStats.map((stat, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{stat.label}:</span>
                  <span className="font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}