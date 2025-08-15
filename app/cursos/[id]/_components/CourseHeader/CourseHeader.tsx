import { useMemo } from "react"
import { Star, Clock, BookOpen, Video, FileText, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import CourseSidebar from "./CourseSidebar"
import ContentCount from "./ContentCount"
import { Content, Course, Enrollment, Module } from "@/types"

interface CourseHeaderProps {
  course: Course
  modules: Module[]
  content: Content[]
  enrollments: Enrollment[]
  isBuyed: boolean
  onShowPlayer: () => void
}

export default function CourseHeader({
  course,
  modules,
  content,
  enrollments,
  isBuyed,
  onShowPlayer
}: CourseHeaderProps) {
  // Memoizar cálculos
  const Thumbnail = course?.thumbnail!! || "/placeholder.svg?height=200&width=400&text=Curso"
  
  const contentCounts = useMemo(() => ({
    video: content.filter((item) => item.type === "video").length,
    document: content.filter((item) => item.type === "document").length,
    quiz: content.filter((item) => item.type === "quiz").length,
  }), [content])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {/* Información principal del curso */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {course.title}
        </h1>
        
        <p className="text-xl text-muted-foreground mb-6">
          {course.description}
        </p>
        
        {/* Estadísticas del curso */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">{course.rating}</span>
            <span className="text-muted-foreground">
              ({enrollments.length} estudiantes)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{course.duration}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <span>{modules.length} módulos</span>
          </div>
          
          <Badge>Online</Badge>
        </div>
        
        {/* Contadores de contenido */}
        <div className="flex flex-wrap gap-4">
          <ContentCount
            icon={<Video className="h-4 w-4 text-primary" />}
            label="videos"
            count={contentCounts.video}
          />
          <ContentCount
            icon={<FileText className="h-4 w-4 text-primary" />}
            label="documentos"
            count={contentCounts.document}
          />
          <ContentCount
            icon={<CheckCircle className="h-4 w-4 text-primary" />}
            label="evaluaciones"
            count={contentCounts.quiz}
          />
        </div>
      </div>
      
      {/* Sidebar con información de compra */}
      <CourseSidebar
        course={course}
        thumbnail={Thumbnail}
        isBuyed={isBuyed}
        onShowPlayer={onShowPlayer}
      />
    </div>
  )
}