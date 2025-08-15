import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Course, Module, Video } from "@/types"

interface VideoInfoProps {
  videoData: Video
  courseData?: Course | null
  moduleData?: Module | null
}

export default function VideoInfo({ videoData, courseData, moduleData }: VideoInfoProps) {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        {videoData?.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Duración */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {videoData?.duration}
          </span>
        </div>
        
        {/* Badge del curso */}
        {courseData && (
          <Badge>{courseData.title}</Badge>
        )}
        
        {/* Badge del módulo */}
        {moduleData && (
          <Badge variant="outline">{moduleData.title}</Badge>
        )}
      </div>
    </>
  )
}