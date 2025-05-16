import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, FileText, CheckSquare } from "lucide-react"

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Módulos</h3>
              <div className="space-y-2">
                {modules.slice(0, 3).map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-2 border rounded-md">
                    <p className="text-sm font-medium">{module.title}</p>
                    <Badge variant={module.status === "Activo" ? "default" : "secondary"}>{module.status}</Badge>
                  </div>
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
                {modules
                  .flatMap((module) =>
                    module.content.slice(0, 3).map((content) => (
                      <div key={content.id} className="flex items-center gap-2 p-2 border rounded-md">
                        {content.type === "video" && <Video className="h-4 w-4 text-primary" />}
                        {content.type === "document" && <FileText className="h-4 w-4 text-primary" />}
                        {content.type === "quiz" && <CheckSquare className="h-4 w-4 text-primary" />}
                        <p className="text-sm">{content.title}</p>
                      </div>
                    )),
                  )
                  .slice(0, 3)}
                <Button variant="ghost" size="sm" className="w-full" onClick={() => handleTabChange("content")}>
                  Ver todo el contenido
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Estudiantes</h3>
              <div className="space-y-2">
                {enrollments.slice(0, 3).map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-2 border rounded-md">
                    <p className="text-sm font-medium">Estudiante #{enrollment.studentId}</p>
                    <Badge variant={enrollment.status === "Completado" ? "default" : "secondary"}>
                      {enrollment.progress}%
                    </Badge>
                  </div>
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