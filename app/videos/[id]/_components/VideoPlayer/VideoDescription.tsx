import { Course, Module } from "@/types"
import { BookOpen, Clock } from "lucide-react"

interface VideoDescriptionProps {
  courseData?: Course | null
  moduleData?: Module | null
}

export default function VideoDescription({ courseData, moduleData }: VideoDescriptionProps) {
  if (courseData && moduleData) {
    return (
      <div className="border-t pt-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Descripción</h2>
        <p className="text-muted-foreground mb-4">
          Este video forma parte del curso "{courseData.title}" y cubre conceptos fundamentales sobre gestión de
          proyectos. Aprenderás técnicas prácticas que podrás aplicar inmediatamente en tu entorno profesional.
        </p>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <span>Parte del módulo: {moduleData.title}</span>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <span>Duración total del curso: {courseData.duration}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t pt-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Descripción</h2>
      <p className="text-muted-foreground mb-4">
        Este es un video independiente, no asociado a ningún curso. Disfruta el contenido gratuito.
      </p>
    </div>
  )
}