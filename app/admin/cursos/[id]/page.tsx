"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCourseById, getModulesByCourseId, getEnrollmentsByCourseId } from "@/lib/utils"
import {
  ArrowLeft,
  Edit,
  Save,
  Plus,
  FileText,
  Video,
  CheckSquare,
  Users,
  Clock,
  DollarSign,
  Star,
  BookOpen,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DeleteCursoDialog } from "@/components/dialog/delete-curso-dialog"
import { DeleteModuloDialog } from "@/components/dialog/delete-modulo-dialog"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const course = getCourseById(params.id)

  if (!course) {
    notFound()
  }

  const modules = getModulesByCourseId(course.id)
  const enrollments = getEnrollmentsByCourseId(course.id)

  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    price: course.price.toString(),
    duration: course.duration,
    status: course.status,
  })

  // Establecer la pestaña activa basada en el parámetro de URL
  useEffect(() => {
    if (tabParam && ["overview", "modules", "content", "students"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "Activo" : "Inactivo" }))
  }

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    // En una implementación real, esto actualizaría la base de datos
    setIsEditing(false)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Actualizar la URL para reflejar la pestaña activa
    router.push(`/admin/cursos/${params.id}?tab=${value}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/cursos">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{isEditing ? "Editar Curso" : course.title}</h1>
          <p className="text-muted-foreground">
            {isEditing ? "Modifica la información del curso" : "Visualiza y gestiona el contenido del curso"}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href={`/admin/cursos/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <DeleteCursoDialog cursoId={params.id} cursoTitle={course.title} variant="outline" />
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Información del Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título del Curso</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Precio (MXN)</Label>
                  <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Duración</Label>
                  <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="status">Estado Activo</Label>
                  <p className="text-xs text-muted-foreground">
                    Determina si el curso está visible para los estudiantes
                  </p>
                </div>
                <Switch id="status" checked={formData.status === "Activo"} onCheckedChange={handleStatusChange} />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
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

                <Button className="w-full" asChild>
                  <Link href={`/cursos/${course.id}`} target="_blank">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Ver en Sitio Web
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=400&width=800&text=${encodeURIComponent(course.title)}`}
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
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Módulos del Curso</h3>
            <Button size="sm" asChild>
              <Link href={`/admin/cursos/${params.id}/modulos/nuevo`}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Módulo
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <Card key={module.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{module.title}</CardTitle>
                    <Badge variant={module.status === "Activo" ? "default" : "secondary"}>{module.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <p>Orden: {module.order}</p>
                      <p>Contenidos: {module.content.length}</p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/cursos/${params.id}/modulos/${module.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                      <DeleteModuloDialog
                        moduloId={module.id}
                        moduloTitle={module.title}
                        cursoId={params.id}
                        variant="outline"
                        size="sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Contenido del Curso</h3>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documentos</SelectItem>
                  <SelectItem value="quiz">Evaluaciones</SelectItem>
                </SelectContent>
              </Select>

              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Añadir Contenido
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="space-y-2">
                <h4 className="font-medium">{module.title}</h4>

                {module.content.map((content) => (
                  <Card key={content.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {content.type === "video" && (
                            <div className="rounded-full bg-red-100 p-2">
                              <Video className="h-4 w-4 text-red-600" />
                            </div>
                          )}
                          {content.type === "document" && (
                            <div className="rounded-full bg-blue-100 p-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                          {content.type === "quiz" && (
                            <div className="rounded-full bg-green-100 p-2">
                              <CheckSquare className="h-4 w-4 text-green-600" />
                            </div>
                          )}

                          <div>
                            <p className="font-medium">{content.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {content.type === "video" && content.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {content.duration}
                                </span>
                              )}
                              {content.type === "quiz" && content.questions && (
                                <span>{content.questions} preguntas</span>
                              )}
                              {content.type === "document" && <span>Documento</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            {content.type === "video" && <Link href={`/admin/videos/${content.id}`}>Ver</Link>}
                            {content.type === "document" && (
                              <Link href={content.url || "#"} target="_blank">
                                Ver
                              </Link>
                            )}
                            {content.type === "quiz" && <Link href={`/admin/quizzes/${content.id}`}>Ver</Link>}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Estudiantes Inscritos</h3>
            <Button size="sm">
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

                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/estudiantes/${enrollment.studentId}`}>Ver Estudiante</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

