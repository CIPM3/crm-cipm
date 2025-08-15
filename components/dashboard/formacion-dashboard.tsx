// src/app/dashboard/FormacionDashboard.tsx (o donde lo ubiques)
"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useGetFormacionStudents } from "@/hooks/formacion/useGetStudentsFormacion"
import { useGetInstructores } from "@/hooks/usuarios/useGetInstructores"
import { agruparCoincidencias, generarEstadisticasCierres } from "@/lib/estadisticas.logic"
import { RechartCard } from "@/components/chart/formacion/recharCard"
import { Skeleton } from "@/components/ui/skeleton"

export function FormacionDashboard() {
  const COLORS = ['#82ca9d', '#0080ff', '#4b5563', '#000000', '#ffc403'];
  const { data: FormacionData, loading, error } = useGetFormacionStudents();
  const { data: Instructores } = useGetInstructores();

  // Mapeo ID → nombre maestro
  const usuariosMap = (Instructores || []).reduce<Record<string, string>>((acc, user) => {
    acc[user.id] = user.name;
    return acc;
  }, {});

  // 1) Generar estadísticas
  const estadisticas = generarEstadisticasCierres(FormacionData || [], usuariosMap);

  // 2) Filtrar pendientes
  const EstudiantesPendientes = (FormacionData || []).filter(
    (student) => student.status === "ESPERA"
  );

  // 3) Agrupar coincidencias
  const coincidencias = agruparCoincidencias(FormacionData);

  return (
    <div className="space-y-6">
      {/* Ejemplo de uso con RechartCard */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-8 overflow-x-hidden">
        {loading ? (
          <>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </>
        ) : (
          <>
            <RechartCard
              title="Distribución por Status"
              description="Estados de los cierres"
              data={estadisticas.porStatus}
              type="bar"
              dataKey="total"
              nameKey="status"
            />
            <RechartCard
              title="Agendados por Semana"
              description="Cantidad por número de semana"
              data={estadisticas.porSemana}
              type="bar"
              dataKey="total"
              nameKey="week"
              colors={COLORS}
            />
            <RechartCard
              title="Distribución por Maestro"
              description="Cantidad por maestro"
              data={estadisticas.porMaestro}
              type="bar"
              dataKey="total"
              nameKey="maestro"
              colors={COLORS}
            />
            <RechartCard
              title="Distribución por Horario"
              description="Frecuencia por hora de clase"
              data={estadisticas.porHorario}
              type="pie"
              dataKey="total"
              nameKey="maestro"
              colors={COLORS}
            />
            <RechartCard
              title="Distribución por Nivel"
              description="Niveles registrados"
              data={estadisticas.porNivel}
              type="pie"
              dataKey="total"
              nameKey="nivel"
              colors={COLORS}
            />
            <RechartCard
              title="Distribución por Modalidad"
              description="Online, Presencial, L-V, Etc."
              data={estadisticas.porModalidad}
              type="pie"
              dataKey="total"
              nameKey="modalidad"
              colors={COLORS}
            />
          </>
        )}
      </div>

      {/* Coincidencias (semana actual) */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Horarios Activos</CardTitle>
            <CardDescription>Semana actual en coincidencias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <Skeleton className="h-24 w-full" />
              ) : coincidencias.length > 0 ? (
                coincidencias.map((grupo, i) => (
                  <div key={i} className="rounded-md border p-4">
                    <h3 className="font-medium">
                      Horario: {grupo.horario} - Semana: {grupo.week}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Maestro: {(Instructores || []).find((x) => x.id === grupo.maestro)?.name}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      Estudiantes: {grupo.estudiantes.length}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No tienes clases registradas por el momento
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estudiantes pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes Pendientes</CardTitle>
            <CardDescription>Estudiantes en status ESPERA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : (
                EstudiantesPendientes.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 rounded-md border p-4"
                  >
                    <Avatar>
                      <AvatarFallback>{student.nombre.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{student.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{student.horario}</p>
                    </div>
                    {student.status === "urgent" && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
