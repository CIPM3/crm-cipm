"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStudentById, getEnrollmentsByStudentId, getCourseById, courses } from "@/lib/utils"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  CheckSquare,
  User,
  Clock,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Save,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function StudentPage({ params }: { params: { id: string } }) {
  const student = getStudentById(params.id)
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)
  const [isUnenrollDialogOpen, setIsUnenrollDialogOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null)
  const [studentData, setStudentData] = useState(student || {})

  if (!student) {
    notFound()
  }

  const enrollments = getEnrollmentsByStudentId(student.id)
  const [studentEnrollments, setStudentEnrollments] = useState(enrollments)

  // Obtener cursos disponibles (no inscritos)
  const enrolledCourseIds = studentEnrollments.map((e) => e.courseId)
  const availableCourses = courses.filter((course) => !enrolledCourseIds.includes(course.id))

  // Calcular métricas del estudiante
  const totalCourses = studentEnrollments.length
  const completedCourses = studentEnrollments.filter((e) => e.status === "Completado").length
  const averageProgress = studentEnrollments.length
    ? Math.round(studentEnrollments.reduce((sum, e) => sum + e.progress, 0) / studentEnrollments.length)
    : 0
  const lastActivity = studentEnrollments.length
    ? new Date(Math.max(...studentEnrollments.map((e) => new Date(e.lastAccess).getTime()))).toLocaleDateString()
    : "N/A"

  // Función para actualizar datos del estudiante
  const handleUpdateStudent = (formData: FormData) => {
    const updatedStudent = {
      ...studentData,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      status: formData.get("status") === "on" ? "Activo" : "Inactivo",
    }
    setStudentData(updatedStudent)
    setIsEditDialogOpen(false)
  }

  // Función para inscribir estudiante en un nuevo curso
  const handleEnrollStudent = (formData: FormData) => {
    const courseId = formData.get("courseId") as string
    if (!courseId) return

    const course = getCourseById(courseId)
    if (!course) return

    const newEnrollment = {
      id: `enroll-${Date.now()}`,
      studentId: student.id,
      courseId: courseId,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "En progreso",
      progress: 0,
      lastAccess: new Date().toISOString().split("T")[0],
    }

    setStudentEnrollments([...studentEnrollments, newEnrollment])
    setIsEnrollDialogOpen(false)
  }

  // Función para dar de baja a un estudiante de un curso
  const handleUnenrollStudent = () => {
    if (!selectedEnrollment) return

    const updatedEnrollments = studentEnrollments.filter((enrollment) => enrollment.id !== selectedEnrollment.id)

    setStudentEnrollments(updatedEnrollments)
    setIsUnenrollDialogOpen(false)
    setSelectedEnrollment(null)
  }

  // Función para actualizar el progreso de un curso
  const handleUpdateProgress = (enrollmentId: string, newProgress: number) => {
    const updatedEnrollments = studentEnrollments.map((enrollment) => {
      if (enrollment.id === enrollmentId) {
        const updatedStatus = newProgress >= 100 ? "Completado" : "En progreso"
        return {
          ...enrollment,
          progress: newProgress,
          status: updatedStatus,
          lastAccess: new Date().toISOString().split("T")[0],
        }
      }
      return enrollment
    })

    setStudentEnrollments(updatedEnrollments)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/estudiantes">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Atrás</span>
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{studentData.name}</h1>
            <Badge variant={studentData.status === "Activo" ? "default" : "secondary"}>{studentData.status}</Badge>
          </div>
          <p className="text-muted-foreground">Detalles del estudiante e información relacionada</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
          <Button onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Estudiante
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={studentData.name} />
                <AvatarFallback>{studentData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-medium">{studentData.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {studentData.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{studentData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <p className="text-sm text-muted-foreground">{studentData.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Último Acceso</p>
                  <p className="text-sm text-muted-foreground">{studentData.lastLogin}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <p className="text-sm text-muted-foreground">{studentData.status}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Métricas del Estudiante</CardTitle>
            <CardDescription>Resumen de actividad y progreso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">Cursos Inscritos</p>
                </div>
                <p className="text-2xl font-bold">{totalCourses}</p>
                <p className="text-sm text-muted-foreground">Total de cursos en los que está inscrito</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">Cursos Completados</p>
                </div>
                <p className="text-2xl font-bold">{completedCourses}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round((completedCourses / totalCourses) * 100) || 0}% de tasa de finalización
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">Progreso Promedio</p>
                </div>
                <p className="text-2xl font-bold">{averageProgress}%</p>
                <p className="text-sm text-muted-foreground">Promedio de avance en todos los cursos</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">Última Actividad</p>
                </div>
                <p className="text-2xl font-bold">{lastActivity}</p>
                <p className="text-sm text-muted-foreground">Fecha de la última interacción</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas interacciones del estudiante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentEnrollments.slice(0, 3).map((enrollment) => {
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
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">Último acceso: {enrollment.lastAccess}</p>
                      </div>
                      <div className="text-sm font-medium">{enrollment.progress}%</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Cursos Inscritos</h3>
            <Button size="sm" onClick={() => setIsEnrollDialogOpen(true)}>
              <BookOpen className="mr-2 h-4 w-4" />
              Inscribir en Nuevo Curso
            </Button>
          </div>

          <div className="grid gap-4">
            {studentEnrollments.length > 0 ? (
              studentEnrollments.map((enrollment) => {
                const course = getCourseById(enrollment.courseId)
                return (
                  <Card key={enrollment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">{course?.title}</CardTitle>
                        <Badge variant={enrollment.status === "Completado" ? "default" : "secondary"}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <p className="text-sm text-muted-foreground">{course?.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Fecha de inscripción</p>
                              <p className="text-sm">{enrollment.enrollmentDate}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Último acceso</p>
                              <p className="text-sm">{enrollment.lastAccess}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Duración</p>
                              <p className="text-sm">{course?.duration}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Progreso: {enrollment.progress}%</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateProgress(enrollment.id, Math.max(0, enrollment.progress - 10))
                                }
                                disabled={enrollment.progress <= 0}
                              >
                                -10%
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateProgress(enrollment.id, Math.min(100, enrollment.progress + 10))
                                }
                                disabled={enrollment.progress >= 100}
                              >
                                +10%
                              </Button>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEnrollment(enrollment)
                              setIsUnenrollDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Dar de Baja
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/admin/cursos/${course?.id}`}>
                              <BookOpen className="mr-2 h-4 w-4" />
                              Ver Curso
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No hay cursos inscritos</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Este estudiante no está inscrito en ningún curso actualmente.
                  </p>
                  <Button onClick={() => setIsEnrollDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Inscribir en un Curso
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Tareas Relacionadas</h3>
            <Button size="sm">
              <CheckSquare className="mr-2 h-4 w-4" />
              Asignar Nueva Tarea
            </Button>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No hay tareas asignadas</p>
                <p className="text-sm text-muted-foreground">Este estudiante no tiene tareas asignadas actualmente.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Actividades</CardTitle>
              <CardDescription>Registro de todas las actividades del estudiante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentEnrollments.map((enrollment, index) => {
                  const course = getCourseById(enrollment.courseId)
                  return (
                    <div key={index} className="flex items-start gap-4 rounded-md border p-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Inscripción en curso</p>
                        <p className="text-sm text-muted-foreground">Se inscribió en el curso "{course?.title}"</p>
                        <p className="text-xs text-muted-foreground">Fecha: {enrollment.enrollmentDate}</p>
                      </div>
                    </div>
                  )
                })}

                {studentEnrollments
                  .filter((e) => e.progress >= 50)
                  .map((enrollment, index) => {
                    const course = getCourseById(enrollment.courseId)
                    return (
                      <div key={`progress-${index}`} className="flex items-start gap-4 rounded-md border p-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <CheckSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Progreso significativo</p>
                          <p className="text-sm text-muted-foreground">
                            Alcanzó el {enrollment.progress}% en el curso "{course?.title}"
                          </p>
                          <p className="text-xs text-muted-foreground">Fecha: {enrollment.lastAccess}</p>
                        </div>
                      </div>
                    )
                  })}

                {studentEnrollments
                  .filter((e) => e.status === "Completado")
                  .map((enrollment, index) => {
                    const course = getCourseById(enrollment.courseId)
                    return (
                      <div key={`completed-${index}`} className="flex items-start gap-4 rounded-md border p-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Award className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Completó curso</p>
                          <p className="text-sm text-muted-foreground">Finalizó el curso "{course?.title}"</p>
                          <p className="text-xs text-muted-foreground">Fecha: {enrollment.lastAccess}</p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para editar estudiante */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Estudiante</DialogTitle>
          </DialogHeader>
          <form action={handleUpdateStudent} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre Completo
                </label>
                <Input id="name" name="name" defaultValue={studentData.name} required />
              </div>

              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </label>
                <Input id="email" name="email" type="email" defaultValue={studentData.email} required />
              </div>

              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input id="phone" name="phone" defaultValue={studentData.phone} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="status" className="text-sm font-medium">
                    Estado Activo
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Determina si el estudiante puede acceder a la plataforma
                  </p>
                </div>
                <Switch id="status" name="status" defaultChecked={studentData.status === "Activo"} />
              </div>

              <div className="grid gap-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notas Adicionales
                </label>
                <Textarea id="notes" name="notes" placeholder="Información adicional sobre el estudiante..." rows={3} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para inscribir en nuevo curso */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Inscribir en Nuevo Curso</DialogTitle>
          </DialogHeader>
          <form action={handleEnrollStudent} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="courseId" className="text-sm font-medium">
                  Seleccionar Curso
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="">Selecciona un curso...</option>
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {availableCourses.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    El estudiante ya está inscrito en todos los cursos disponibles.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={availableCourses.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Inscribir
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para dar de baja de un curso */}
      <AlertDialog open={isUnenrollDialogOpen} onOpenChange={setIsUnenrollDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción dará de baja al estudiante del curso
              <span className="font-semibold"> {getCourseById(selectedEnrollment?.courseId)?.title}</span>. Todo el
              progreso asociado se perderá.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnenrollStudent} className="bg-destructive text-destructive-foreground">
              Dar de Baja
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmación para eliminar estudiante */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al estudiante
              <span className="font-semibold"> {studentData.name}</span> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

