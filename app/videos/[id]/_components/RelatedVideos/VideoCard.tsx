import Link from "next/link"
import { Play } from "lucide-react"
import { Video } from "@/types"

interface VideoCardProps {
  video: Video
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/${video.id}`}>
      <div className="flex gap-3 group">
        {/* Video thumbnail */}
        <div className="relative size-28 h-20 flex-shrink-0">
          <img
            src={video.thumbnail || "/placeholder.svg?height=64&width=96&text=Video"}
            alt={video.title}
            className="w-full h-full object-cover rounded-md"
          />
          
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="rounded-full bg-primary/90 p-1 text-primary-foreground">
              <Play className="h-3 w-3" />
            </div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-1 right-1 bg-black/70 px-1 text-[10px] text-white rounded">
            {video.duration}
          </div>
        </div>
        
        {/* Video info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h4>
          {video.moduleTitle && (
            <p className="text-xs text-muted-foreground mt-1">
              {video.moduleTitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}