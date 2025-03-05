import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { courses } from "@/lib/utils"
import { Edit, Plus, Star } from "lucide-react"
import { DeleteCursoDialog } from "@/components/dialog/delete-curso-dialog"

export default function AdminCoursesPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Cursos</h1>
        <Button asChild>
          <Link href="/admin/cursos/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Curso
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(course.title)}`}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <Badge variant={course.status === "Activo" ? "default" : "secondary"}>{course.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-medium">{course.rating}</span>
                  <span className="text-xs text-muted-foreground">({course.enrollments})</span>
                </div>
                <div className="text-sm font-bold">${course.price.toLocaleString()}</div>
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/admin/cursos/${course.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </Link>
                </Button>
                <DeleteCursoDialog
                  cursoId={course.id}
                  cursoTitle={course.title}
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

