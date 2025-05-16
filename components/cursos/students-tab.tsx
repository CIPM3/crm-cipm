import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function StudentsTab({ enrollments }: { enrollments: any[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center justify-between">
        <h3 className="text-lg font-medium">Estudiantes Inscritos</h3>
        <Button size="sm" className="max-w-fit  ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Inscribir Estudiante
        </Button>
      </div>

      <div className="space-y-4">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Estudiante #{enrollment.studentId}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Inscrito: {enrollment.enrollmentDate}</span>
                    <span>Último acceso: {enrollment.lastAccess}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <Badge variant={enrollment.status === "Completado" ? "default" : "secondary"}>
                      {enrollment.status}
                    </Badge>
                    <div className="mt-1 w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button variant="ghost" asChild>
                    <Link 
                     //href={`/admin/estudiantes/${enrollment.studentId}`}
                     href={`/admin/cursos/`}
                    >
                      <span className="flex items-center">Ver Estudiante</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}