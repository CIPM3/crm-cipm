import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, FileText, CheckSquare } from "lucide-react"
import { useGetContentsByModuleId } from "@/hooks/contenidos"
import { Module } from '../../types/index';
import { useGetUsuarioById } from "@/hooks/usuarios/useGetUsuariosById"

export function OverviewTab({
  course,
  modules,
  enrollments,
  handleTabChange,
}: {
  course: any
  modules: any[]
  enrollments: any[]
  handleTabChange: (value: string) => void
}) {
  const Thumbnail = course?.thumbnail!! || "/placeholder.svg?height=200&width=400&text=Curso"

  const { content } = useGetContentsByModuleId(course.id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Curso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={Thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Módulos</h3>
              <div className="space-y-2">
                {modules.slice(0, 3).map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
                {modules.length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => handleTabChange("modules")}>
                    Ver todos los módulos
                  </Button>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Contenido</h3>
              <div className="space-y-2">
                {
                  content.map((content) => (
                    <ContenidoCard key={content.id} content={content} />
                  )
                  )
                }
                <Button variant="ghost" size="sm" className="w-full" onClick={() => handleTabChange("content")}>
                  Ver todo el contenido
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Estudiantes</h3>
              <div className="space-y-2">
                {enrollments.slice(0, 2).map((enrollment) => (
                  <EstudianteCard key={enrollment.id} enrollment={enrollment} />
                ))}
                <Button variant="ghost" size="sm" className="w-full" onClick={() => handleTabChange("students")}>
                  Ver todos los estudiantes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ModuleCard = ({ module }: { module: Module }) => {
  return (
    <div key={module.id} className="flex items-center justify-between p-2 border rounded-md">
      <p className="text-sm font-medium">{module.title}</p>
      <Badge variant={module.status === "Activo" ? "default" : "secondary"}>{module.status}</Badge>
    </div>
  )
}

const ContenidoCard = ({ content }: { content: any }) => {
  return (
    <div key={content.id} className="flex items-center gap-2 p-2 border rounded-md">
      {content.type === "video" && <Video className="h-4 w-4 text-primary" />}
      {content.type === "document" && <FileText className="h-4 w-4 text-primary" />}
      {content.type === "quiz" && <CheckSquare className="h-4 w-4 text-primary" />}
      <p className="text-sm">{content.title}</p>
    </div>
  )
}

const EstudianteCard = ({ enrollment }: { enrollment: any }) => {
  const { usuario } = useGetUsuarioById(enrollment.studentId)
  return (
    <div className="p-4 border rounded-md">
      <h4 className="text-sm font-medium">Estudiante {usuario?.name}</h4>
      <div className="flex items-center justify-between mt-2">
        <Badge variant={enrollment.status === "Completado" ? "default" : "secondary"}>
          Progreso: {enrollment.progress}%
        </Badge>
        <p className="text-xs text-muted-foreground">Inscrito: {enrollment.enrollmentDate}</p>

      </div>

    </div>
  )
}