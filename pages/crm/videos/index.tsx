import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { modules, getCourseById } from "@/lib/utils"
import { Clock, Edit, Play, Plus } from "lucide-react"
import { DeleteVideoDialog } from "@/components/dialog/delete-video-dialog"
import VideoCard from "@/components/card/video-card"

export default function AdminVideosPage() {
  // Extraer todos los videos de los módulos
  const allVideos = modules.flatMap((module) => {
    const course = getCourseById(module.courseId)
    return module.content
      .filter((content) => content.type === "video")
      .map((video) => ({
        ...video,
        moduleId: module.id,
        moduleTitle: module.title,
        courseId: module.courseId,
        courseName: course?.title || "",
        moduleStatus: module.status,
      }))
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Videos</h1>
        <Button asChild>
          <Link href="/admin/videos/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Video
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allVideos.map((video, index) => (
          <VideoCard
            key={video.id}
            type="crm"
            video={video}
          />
        ))}
      </div>
    </div>
  )
}

