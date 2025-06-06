"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BookOpen, Award, GraduationCap, Clock } from "lucide-react"

export default function StudentMetricsCard({ student, enrollments }: { student: any; enrollments: any[] }) {
  const totalCourses = enrollments.length
  const completedCourses = enrollments.filter((e) => e.status === "Completado").length
  const averageProgress = totalCourses
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses)
    : 0
  const lastActivity = totalCourses
    ? new Date(Math.max(...enrollments.map((e) => new Date(e.lastAccess).getTime()))).toLocaleDateString()
    : "N/A"

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Métricas del Estudiante</CardTitle>
        <CardDescription>Resumen de actividad y progreso</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <MetricItem icon={<BookOpen />} label="Cursos Inscritos" value={enrollments.length} description="Total de cursos en los que está inscrito" />
          <MetricItem icon={<Award />} label="Cursos Completados" value={completedCourses} description={`${totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}% de tasa de finalización`} />
          <MetricItem icon={<GraduationCap />} label="Progreso Promedio" value={`${averageProgress}%`} description="Promedio de avance en todos los cursos" />
          <MetricItem icon={<Clock />} label="Última Actividad" value={lastActivity} description="Fecha de la última interacción" />
        </div>
      </CardContent>
    </Card>
  )
}

function MetricItem({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  description: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 text-primary">{icon}</div>
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
