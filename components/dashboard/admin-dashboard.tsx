"use client"

import { StatCard } from "@/components/card/stat-card"
import { ExtendedRechartCard } from "@/components/chart/instructor/rechartCard"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetAgendados } from "@/hooks/agendador/useGetAgendados"
import { useGetInstructores } from "@/hooks/usuarios/useGetInstructores"
import { useGetFormacionStudents } from "@/hooks/formacion/useGetStudentsFormacion"
import { useMemo } from "react"
import { generarEstadisticas, generarEstadisticasCierres } from "@/lib/estadisticas.logic"
import { getWeek, getYear } from "date-fns"
import { useGetAgendadores } from "@/hooks/agendador/useGetAgendadores"

const COLORS = ['#82ca9d', '#0080ff', '#4b5563', '#000000', '#ffc403']

export function AdminDashboard() {
  const { Usuarios: Agendados, loading: loadingAgendados } = useGetAgendados()
  const { Instructores, loading: loadingInstructores } = useGetInstructores()
  const { FormacionData, loading: loadingFormacion } = useGetFormacionStudents()
  const { Agendadores, loading: loadingAgendadores } = useGetAgendadores()

  const isLoading = loadingAgendados || loadingInstructores || loadingFormacion || loadingAgendadores

  // Mapeo de usuarios
  const usuariosMap = Instructores.reduce((acc, user) => {
    acc[user.id] = user.name
    return acc
  }, {} as Record<string, string>)

  // Generar estadísticas combinadas
  const estadisticasAgendador = useMemo(() => {
    const porAgendador = Agendadores.reduce((acc, user) => {
      const totalAgendados = Agendados.filter((agendado) => agendado.quienAgendo === user.id).length
      acc.push({ nombre: user.name, total: totalAgendados })
      return acc
    }, [] as { nombre: string; total: number }[])
    return {
      porAgendador,
    } as const
  }, [Agendadores, Agendados])

  const estadisticasCierre = useMemo(() => generarEstadisticasCierres(FormacionData, usuariosMap), [FormacionData])
  const estadisticasAgendados = useMemo(() => generarEstadisticas(Agendados, usuariosMap), [Agendados])
  const estadisticasFormacion = useMemo(() => generarEstadisticas(FormacionData, usuariosMap), [FormacionData])

  // Datos generales
  const totalAgendados = Agendados.length
  const totalFormacion = FormacionData.length
  const totalInstructores = Instructores.length
  const AnoSemana = `${getYear(new Date()).toString().replace("20", "")}${getWeek(new Date())}`

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas generales */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatCard
              borderColorClass="border-l-blue-500"
              icon={<span className="h-4 w-4 text-blue-500">📅</span>}
              title="Total Agendados"
              value={totalAgendados}
              description="Eventos agendados en el sistema"
            />
            <StatCard
              borderColorClass="border-l-green-500"
              icon={<span className="h-4 w-4 text-green-500">👨‍🏫</span>}
              title="Total Formación"
              value={totalFormacion}
              description="Estudiantes en formación"
            />
            <StatCard
              borderColorClass="border-l-purple-500"
              icon={<span className="h-4 w-4 text-purple-500">👥</span>}
              title="Total Instructores"
              value={totalInstructores}
              description="Instructores registrados"
            />
            <StatCard
              borderColorClass="border-l-amber-500"
              icon={<span className="h-4 w-4 text-amber-500">📆</span>}
              title="Semana Actual"
              value={AnoSemana}
              description="Periodo actual"
            />
          </>
        )}
      </div>

      {/* Gráficas combinadas */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8">
        {isLoading ? (
          <>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </>
        ) : (
          <>
            <ExtendedRechartCard
              title="Agendados por Semana"
              description="Cantidad de eventos agendados por semana"
              data={estadisticasAgendados.porSemana}
              type="bar"
              dataKey="total"
              nameKey="week"
              colors={COLORS}
            />
            <ExtendedRechartCard
              title="Distribución de Cierre"
              description="Estados de los cierres"
              data={estadisticasCierre.porStatus}
              type="pie"
              dataKey="total"
              nameKey="status"
              colors={COLORS}
            />
            <ExtendedRechartCard
              title="Distribución por Horario"
              description="Frecuencia de horarios agendados"
              data={estadisticasAgendados.porHorario}
              type="pie"
              dataKey="total"
              nameKey="horario"
              colors={COLORS}
            />
            <ExtendedRechartCard
              title="Distribución por Instructor"
              description="Eventos asignados por maestro"
              data={estadisticasFormacion.porMaestro}
              type="bar"
              dataKey="total"
              nameKey="maestro"
              colors={COLORS}
            />
            <ExtendedRechartCard
              title="Distribución por Nivel"
              description="Niveles registrados en formación"
              data={estadisticasFormacion.porNivel}
              type="pie"
              dataKey="total"
              nameKey="nivel"
              colors={COLORS}
            />
            <ExtendedRechartCard
              title="Distribución por Modalidad"
              description="Modalidades de formación (Online, Presencial, etc.)"
              data={estadisticasFormacion.porTipo}
              type="pie"
              dataKey="total"
              nameKey="tipo"
              colors={COLORS}
            />
            <ExtendedRechartCard
              title="Distribución por Agendador"
              description="Eventos asignados por el agendador"
              data={estadisticasAgendador.porAgendador}
              type="bar"
              dataKey="total"
              nameKey="nombre"
              colors={COLORS}
            />
            <ExtendedRechartCard
              title="Distribución por Edad"
              description="Frecuencia de edades de los estudiantes"
              data={estadisticasAgendados.porEdad}
              type="bar"
              dataKey="total"
              nameKey="tipo"
              colors={COLORS}
            />
          </>
        )}
      </div>
    </div>
  )
}