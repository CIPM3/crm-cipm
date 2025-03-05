"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { courses, students, enrollments } from "@/lib/utils"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
  // Data for course status chart
  const courseStatus = courses.reduce(
    (acc, course) => {
      acc[course.status] = (acc[course.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const courseStatusData = Object.entries(courseStatus).map(([name, value]) => ({
    name,
    value,
  }))

  // Data for student status chart
  const studentStatus = students.reduce(
    (acc, student) => {
      acc[student.status] = (acc[student.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const studentStatusData = Object.entries(studentStatus).map(([name, value]) => ({
    name,
    value,
  }))

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

  // Data for course popularity
  const coursePopularityData = courses
    .map((course) => ({
      name: course.title.length > 20 ? course.title.substring(0, 20) + "..." : course.title,
      value: course.enrollments,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // Colors for charts
  const COLORS = ["#0066FF", "#FFBB28", "#00C49F", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground">Analiza el rendimiento de tu plataforma educativa</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Datos
        </Button>
      </div>

      <Tabs defaultValue="cursos">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="cursos">Cursos</TabsTrigger>
          <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
          <TabsTrigger value="inscripciones">Inscripciones</TabsTrigger>
        </TabsList>

        <TabsContent value="cursos" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Cursos</CardTitle>
                <CardDescription>Distribución de cursos por estado</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
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
                      {courseStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Cursos"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cursos Más Populares</CardTitle>
                <CardDescription>Top 5 cursos por número de inscripciones</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={coursePopularityData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [value, "Inscripciones"]} />
                    <Bar dataKey="value" fill="#0066FF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Curso</CardTitle>
              <CardDescription>Ingresos generados por cada curso</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={courses.map((course) => ({
                    name: course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title,
                    value: course.price * course.enrollments,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`]} />
                  <Bar dataKey="value" fill="#0066FF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estudiantes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Estudiantes</CardTitle>
                <CardDescription>Distribución de estudiantes por estado</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentStatusData}
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
                    <Tooltip formatter={(value) => [value, "Estudiantes"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adquisición de Estudiantes</CardTitle>
                <CardDescription>Nuevos estudiantes por mes</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Ene", value: 2 },
                      { name: "Feb", value: 3 },
                      { name: "Mar", value: 1 },
                      { name: "Abr", value: 4 },
                      { name: "May", value: 2 },
                      { name: "Jun", value: 5 },
                      { name: "Jul", value: 3 },
                      { name: "Ago", value: 2 },
                      { name: "Sep", value: 4 },
                      { name: "Oct", value: 6 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, "Nuevos Estudiantes"]} />
                    <Bar dataKey="value" fill="#0066FF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cursos por Estudiante</CardTitle>
              <CardDescription>Promedio de cursos inscritos por estudiante</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: "Ene", value: 1.2 },
                    { name: "Feb", value: 1.3 },
                    { name: "Mar", value: 1.5 },
                    { name: "Abr", value: 1.7 },
                    { name: "May", value: 1.8 },
                    { name: "Jun", value: 1.9 },
                    { name: "Jul", value: 2.0 },
                    { name: "Ago", value: 2.1 },
                    { name: "Sep", value: 2.3 },
                    { name: "Oct", value: 2.5 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, "Cursos por Estudiante"]} />
                  <Line type="monotone" dataKey="value" stroke="#0066FF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inscripciones" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Inscripciones</CardTitle>
                <CardDescription>Distribución de inscripciones por estado</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={enrollmentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {enrollmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Inscripciones"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inscripciones Mensuales</CardTitle>
                <CardDescription>Tendencia de inscripciones en los últimos 10 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tasa de Finalización</CardTitle>
              <CardDescription>Porcentaje de estudiantes que completan cada curso</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={courses.map((course) => {
                    const courseEnrollments = enrollments.filter((e) => e.courseId === course.id)
                    const completedEnrollments = courseEnrollments.filter((e) => e.status === "Completado")
                    const completionRate = courseEnrollments.length
                      ? (completedEnrollments.length / courseEnrollments.length) * 100
                      : 0

                    return {
                      name: course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title,
                      value: Math.round(completionRate),
                    }
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Tasa de Finalización"]} />
                  <Bar dataKey="value" fill="#0066FF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

