import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Play, FileText, Award } from "lucide-react"
import { Content, ContentsByModule, Course, Module } from "@/types"

interface CourseContentProps {
  modules: Module[]
  course: Course
  contentsByModule: ContentsByModule
}

const LEARNING_OBJECTIVES = [
  "Dominar los fundamentos de la gestión de proyectos",
  "Aplicar metodologías ágiles en entornos reales",
  "Desarrollar habilidades de liderazgo efectivo",
  "Prepararte para certificaciones internacionales"
] as const

const getContentIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Play className="h-5 w-5 text-primary" />
    case "document":
      return <FileText className="h-5 w-5 text-primary" />
    case "quiz":
      return <CheckCircle className="h-5 w-5 text-primary" />
    default:
      return <FileText className="h-5 w-5 text-primary" />
  }
}

const getContentBadge = (type: string) => {
  switch (type) {
    case "video":
      return "Video"
    case "document":
      return "Documento"
    case "quiz":
      return "Evaluación"
    default:
      return "Contenido"
  }
}

const getContentDescription = (content: Content) => {
  if (content.type === "video" || content.type === "document") {
    return content.duration
  }
  if (content.type === "quiz") {
    return `${content.questions} preguntas`
  }
  return "Material de lectura"
}

export default function CourseContent({
  modules,
  course,
  contentsByModule
}: CourseContentProps) {
  return (
    <div className="space-y-6">
      {/* Learning Objectives */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Lo que aprenderás</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEARNING_OBJECTIVES.map((objective, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>{objective}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Course Modules */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Módulos del curso</h2>
        <div className="space-y-4">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              moduleIndex={index}
              contents={contentsByModule[module.id] || []}
              courseId={course.id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

interface ModuleCardProps {
  module: Module
  moduleIndex: number
  contents: Content[]
  courseId: string
}

function ModuleCard({ module, moduleIndex, contents, courseId }: ModuleCardProps) {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">
          Módulo {moduleIndex + 1}: {module.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          {contents.map((content, contentIndex) => (
            <ContentItem
              key={contentIndex}
              content={content}
              courseId={courseId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface ContentItemProps {
  content: Content
  courseId: string
}

function ContentItem({ content, courseId }: ContentItemProps) {
  return (
    <Link
      href={`/cursos/${courseId}`}
      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
    >
      {getContentIcon(content.type)}
      <div className="flex-1">
        <p className="font-medium">{content.title}</p>
        <p className="text-sm text-muted-foreground">
          {getContentDescription(content)}
        </p>
      </div>
      <Badge variant="outline">
        {getContentBadge(content.type)}
      </Badge>
    </Link>
  )
}