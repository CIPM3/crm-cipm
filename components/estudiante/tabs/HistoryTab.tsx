import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useGetCourseById } from "@/hooks/cursos"
import { getCourseById } from "@/lib/utils"
import { BookOpen, Award, CheckSquare } from "lucide-react"

export default function HistoryTab({ enrollments }: { enrollments: any[] }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Actividades</CardTitle>
        <CardDescription>Registro de todas las actividades del estudiante</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enrollments.map((e) => {
          const {course} = useGetCourseById(e.courseId)
          return (
            <div key={e.id} className="flex items-start gap-4 border p-4 rounded-md">
              <div className="rounded-full bg-primary/10 p-2">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Inscripción en curso</p>
                <p className="text-sm text-muted-foreground">Curso: {course?.title}</p>
                <p className="text-xs text-muted-foreground">Fecha: {e.enrollmentDate}</p>
              </div>
            </div>
          )
        })}

        {enrollments
          .filter((e) => e.progress >= 50)
          .map((e) => {
            const course = getCourseById(e.courseId)
            return (
              <div key={`progress-${e.id}`} className="flex items-start gap-4 border p-4 rounded-md">
                <div className="rounded-full bg-primary/10 p-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Progreso significativo</p>
                  <p className="text-sm text-muted-foreground">
                    Alcanzó {e.progress}% en el curso "{course?.title}"
                  </p>
                  <p className="text-xs text-muted-foreground">Fecha: {e.lastAccess}</p>
                </div>
              </div>
            )
          })}

        {enrollments
          .filter((e) => e.status === "Completado")
          .map((e) => {
            const course = getCourseById(e.courseId)
            return (
              <div key={`completed-${e.id}`} className="flex items-start gap-4 border p-4 rounded-md">
                <div className="rounded-full bg-primary/10 p-2">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Curso completado</p>
                  <p className="text-sm text-muted-foreground">Curso: {course?.title}</p>
                  <p className="text-xs text-muted-foreground">Fecha: {e.lastAccess}</p>
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
