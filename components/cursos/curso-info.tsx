import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, DollarSign, Star, Users } from "lucide-react"
import { Button } from "../ui/button";
import Link from "next/link";

export function CursoInfo({ course, modules, enrollments }: { course: any; modules: any[]; enrollments: any[] }) {

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Información del Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Descripción</h3>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Precio</p>
                </div>
                <p className="text-xl font-bold">${course.price.toLocaleString()}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Duración</p>
                </div>
                <p className="text-xl font-bold">{course.duration}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Inscripciones</p>
                </div>
                <p className="text-xl font-bold">{course.enrollments}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Calificación</p>
                </div>
                <p className="text-xl font-bold">{course.rating}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">Estado del Curso</p>
              <Badge variant={course.status === "Activo" ? "default" : "secondary"}>{course.status}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-medium">Módulos</p>
              <p className="text-lg font-bold">{modules.length}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-medium">Estudiantes</p>
              <p className="text-lg font-bold">{enrollments.length}</p>
            </div>

            <Button
              className="w-full"
              asChild
            >
              <Link 
              //href={`/cursos/${course.id}`} 
              href={"/"}
              target="_blank" 
              className="flex items-center">
                <span className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Ver en Sitio Web
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}