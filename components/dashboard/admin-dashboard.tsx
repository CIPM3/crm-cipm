"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { students, courses, enrollments, tasks } from "@/lib/utils"
import { Users, BookOpen, CheckSquare, TrendingUp } from "lucide-react"

export function AdminDashboard() {
  // Calculate summary metrics
  const totalStudents = students.length
  const totalCourses = courses.length
  const activeCourses = courses.filter((course) => course.status === "Activo").length
  const totalEnrollments = enrollments.length
  const pendingTasks = tasks.filter((task) => task.status !== "Completado").length

  // Data for course status chart
  const courseStatusData = [
    { name: "Activos", value: activeCourses },
    { name: "Inactivos", value: totalCourses - activeCourses },
  ]

  // Data for enrollment status chart
  const enrollmentStatus = enrollments.reduce(
    (acc, enrollment) => {
      acc[enrollment.status] = (acc[enrollment.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const enrollmentStatusData = Object.entries(enrollmentStatus).map(([name, value]) => ({
    name,
    value,
  }))

  // Data for monthly enrollments chart
  const monthlyEnrollmentsData = [
    { name: "Ene", value: 12 },
    { name: "Feb", value: 15 },
    { name: "Mar", value: 18 },
    { name: "Abr", value: 14 },
    { name: "May", value: 10 },
    { name: "Jun", value: 8 },
    { name: "Jul", value: 5 },
    { name: "Ago", value: 9 },
    { name: "Sep", value: 16 },
    { name: "Oct", value: 22 },
  ]

  // Colors for pie chart
  const COLORS = ["#0088FE", "#FFBB28", "#00C49F", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourses}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeCourses / totalCourses) * 100)}% del total de cursos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inscripciones</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">+5 desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((pendingTasks / tasks.length) * 100)}% del total de tareas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inscripciones Mensuales</CardTitle>
            <CardDescription>Tendencia de inscripciones en los últimos 10 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-80 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEnrollmentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [value, "Inscripciones"]} />
                <Bar dataKey="value" fill="#0066FF" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Cursos</CardTitle>
            <CardDescription>Distribución de cursos por estado</CardDescription>
          </CardHeader>
          <CardContent className="h-80 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#0066FF" />
                  <Cell fill="#FFBB28" />
                </Pie>
                <Tooltip formatter={(value) => [value, "Cursos"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Actividades Recientes</CardTitle>
            <CardDescription>Últimas actualizaciones de la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Nuevo estudiante registrado</p>
                  <p className="text-sm text-muted-foreground">Roberto Martínez se ha registrado en la plataforma</p>
                  <p className="text-xs text-muted-foreground">Hace 2 días</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="rounded-full bg-secondary/10 p-2">
                  <BookOpen className="h-4 w-4 text-secondary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Curso actualizado</p>
                  <p className="text-sm text-muted-foreground">
                    Se ha actualizado el contenido del curso "Certificación PMP - Preparación"
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 3 días</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Tarea completada</p>
                  <p className="text-sm text-muted-foreground">Revisión de calificaciones del curso de Liderazgo</p>
                  <p className="text-xs text-muted-foreground">Hace 5 días</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

