import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { modules, getCourseById } from "@/lib/utils"
import { Clock, Edit, Play, Plus } from "lucide-react"
import { DeleteVideoDialog } from "@/components/dialog/delete-video-dialog"

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
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-muted relative">
              <img
                src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(video.title)}`}
                alt={video.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-primary/90 p-3 text-primary-foreground">
                  <Play className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs text-white rounded">
                {video.duration}
              </div>
            </div>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-1">{video.title}</CardTitle>
                <Badge variant={video.moduleStatus === "Activo" ? "default" : "secondary"}>{video.moduleStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{video.courseName}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Módulo: {video.moduleTitle}</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{video.duration}</span>
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/admin/videos/${video.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </Link>
                </Button>
                <DeleteVideoDialog
                  videoId={video.id}
                  videoTitle={video.title}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

