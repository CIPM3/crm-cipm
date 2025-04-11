"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/calendario/calendario-instructor"
import { BookOpen, Users, Clock, CalendarIcon, FileText } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGetInstructores } from "@/hooks/usuarios/useGetInstructores"
import { useMemo } from "react"
import { useGetEstudiantes } from "@/hooks/estudiantes/clases-prueba/useGetStudents"
import { useGetAgendados } from "@/hooks/agendador/useGetAgendados"
import { getWeek, getYear } from "date-fns"
import { StatCard } from "../card/stat-card"
import { ExtendedRechartCard } from "../chart/instructor/rechartCard"
import { generarEstadisticas } from "@/lib/estadisticas.logic"


const COLORS = ['#82ca9d', '#0080ff', '#4b5563', '#000000', '#ffc403']


export function InstructorDashboard() {
  const User = useAuthStore((state) => state.user)
  const { Instructores } = useGetInstructores()
  const { Usuarios: Agendados } = useGetAgendados()
  const { Users: Estudiantes } = useGetEstudiantes();
  const CalendarAgendados = Agendados.filter((agendado) => {
    if (User?.role === "admin" || User?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3") return Agendados
    else return agendado.quienAgendo === User?.id
  })
  const InstructorAgendados = Estudiantes.filter((agendado) => {
    if (User?.role === "admin" || User?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3") return Estudiantes
    else return agendado.maestro === User?.id
  })

  const usuariosMap = Instructores.reduce((acc, user) => {
    acc[user.id] = user.name;
    return acc;
  }, {} as Record<string, string>);

  const estadisticas = useMemo(
    () => generarEstadisticas(InstructorAgendados, usuariosMap),
    [InstructorAgendados]
  )
  // Datos simulados para el instructor
  const AnoSemana = `${getYear(new Date()).toString().replace("20", "")}${getWeek(new Date())}`
  const totalStudents = Estudiantes.length
  const mostUsedHour = estadisticas.porHorario.reduce((prev, current) => {
    return (prev.total > current.total) ? prev : current
  }, { horario: "", total: 0 }).horario
  const mostCommonlevel = estadisticas.porNivel.reduce((prev, current) => {
    return (prev.total > current.total) ? prev : current
  }, { nivel: "", total: 0 }).nivel

  console.log(estadisticas)
  // 7. Render final
  return (
    <div className="space-y-6">
      {/* Tarjetas (stats) */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          borderColorClass="border-l-indigo-500"
          icon={<BookOpen className="h-4 w-4 text-indigo-500" />}
          title="Semana Actual"
          value={AnoSemana}
          description="Periodo actual"
        />

        <StatCard
          borderColorClass="border-l-purple-500"
          icon={<Users className="h-4 w-4 text-purple-500" />}
          title="Estudiantes"
          value={totalStudents}
          description="Total de estudiantes"
        />

        <StatCard
          borderColorClass="border-l-amber-500"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          title="Horario más usado"
          value={mostUsedHour || "N/A"}
        />

        <StatCard
          borderColorClass="border-l-teal-500"
          icon={<FileText className="h-4 w-4 text-teal-500" />}
          title="Nivel más común"
          value={mostCommonlevel || "N/A"}
        />
      </div>

      {/* Calendario para instructor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario de Clases
          </CardTitle>
          <CardDescription>Horario de clases y actividades programadas</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Calendar estudiantes={CalendarAgendados} />
        </CardContent>
      </Card>

      {/* Sección de gráficas */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8">
        {/* Por semana */}
        <ExtendedRechartCard
          title="Agendados por semana"
          description="Cantidad por numero de semana"
          data={estadisticas.porSemana}
          type="bar"
          dataKey="total"
          nameKey="week"
          colors={COLORS}
        />
        {/* Por horario */}
        <ExtendedRechartCard
          title="Distribución por Horario"
          description="Porporción de clases por hora"
          data={estadisticas.porHorario}
          type="pie"
          dataKey="total"
          nameKey="horario"
          colors={COLORS}
        />

        {/* Por día */}
        <ExtendedRechartCard
          title="Distribución por Dia"
          description="Ej. L-V, S-D"
          data={estadisticas.porDia}
          type="bar"
          dataKey="total"
          nameKey="dia"
          colors={COLORS}
          barOrientation="horizontal"
        />

        {/* Por nivel */}
        <ExtendedRechartCard
          title="Distribución por nivel"
          description="Estudiantes segun el nivel"
          data={estadisticas.porNivel}
          type="pie"
          dataKey="total"
          nameKey="nivel"
          colors={COLORS}
        />

        {/* Por maestro */}
        <div className="col-span-2">
          <ExtendedRechartCard
            title="Distribución por Maestro"
            description="Estudiantes asignados por instructor"
            data={estadisticas.porMaestro}
            type="bar"
            dataKey="total"
            nameKey="maestro"
            colors={COLORS}
          />
        </div>
      </div>
    </div>
  )
}
