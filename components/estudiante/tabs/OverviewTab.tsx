import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { getCourseById } from "@/lib/utils"

export default function OverviewTab({ enrollments }: { enrollments: any[] }) {
  const recent = enrollments.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas interacciones del estudiante</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recent.map((enrollment) => {
          const course = getCourseById(enrollment.courseId)
          return (
            <div key={enrollment.id} className="flex items-start gap-4 rounded-md border p-4">
              <div className="rounded-full bg-primary/10 p-2">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {enrollment.status === "Completado" ? "Completó el curso" : "Progreso en el curso"}
                </p>
                <p className="text-sm text-muted-foreground">{course?.title}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Último acceso: {enrollment.lastAccess}</p>
              </div>
              <div className="text-sm font-medium">{enrollment.progress}%</div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
