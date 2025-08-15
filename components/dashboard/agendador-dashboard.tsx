"use client"

import { Clock, CheckCircle } from "lucide-react"

import { useGetAgendados } from "@/hooks/agendador/useGetAgendados"
import { useGetAgendadores } from "@/hooks/agendador/useGetAgendadores"
import { useMemo } from "react"
import { PieHorarioChart } from "@/components/chart/agendados/horario-chart"
import { PieTipoChart } from "@/components/chart/agendados/tipo-chart"
import { PieEdadChart } from "@/components/chart/agendados/edad-chart"

import { getWeek, getYear } from "date-fns"
import { useAuthStore } from "@/store/useAuthStore"
import BarSemanaChart from "@/components/chart/agendados/semana-chart"
import { StatCard } from "@/components/card/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExtendedRechartCard } from "../chart/instructor/rechartCard"

const COLORS = ['#82ca9d', '#0080ff', '#4b5563', '#000000', '#ffc403']

const generarEstadisticas = (agendados: any[], usuariosMap: Record<string, string>) => {
  const porSemana: Record<string, number> = {};
  const porHorario: Record<string, number> = {};
  const porTipo: Record<string, number> = {};
  const porEdad: Record<string, number> = {};
  const porQuienAgendo: Record<string, number> = {};

  agendados.forEach((item) => {
    // Semana
    porSemana[item.anoSemana] = (porSemana[item.anoSemana] || 0) + 1;

    // Horario
    porHorario[item.horaClasePrueba] = (porHorario[item.horaClasePrueba] || 0) + 1;

    // Tipo
    porTipo[item.modalidad] = (porTipo[item.modalidad] || 0) + 1;

    // Edad
    porEdad[item.mayorEdad] = (porEdad[item.mayorEdad] || 0) + 1;

    // Quien agendó
    const nombre = usuariosMap[item.quienAgendo] || "Desconocido";
    porQuienAgendo[nombre] = (porQuienAgendo[nombre] || 0) + 1;
  });

  return {
    porSemana: Object.entries(porSemana).map(([week, total]) => ({ week, total })),
    porHorario: Object.entries(porHorario).map(([horario, total]) => ({ horario, total })),
    porTipo: Object.entries(porTipo).map(([tipo, total]) => ({ tipo, total })),
    porEdad: Object.entries(porEdad).map(([tipo, total]) => ({ tipo, total })),
    porQuienAgendo: Object.entries(porQuienAgendo).map(([nombre, total]) => ({ nombre, total })),
  };
};

export function AgendadorDashboard() {
  const { data: Agendados, loading, error } = useGetAgendados();
  const { data: Agendadores, loading: loadingAg, error: errorAg } = useGetAgendadores();
  const User = useAuthStore((state) => state.user);

  const agendadosFiltered = (Agendados || []).filter((agendado) => {
    if (User?.role === "admin" || User?.id === "fZBbWtrIihQvkITliDfLHHhK6rA3") return Agendados;
    else return agendado.quienAgendo === User?.id;
  });

  const usuariosMap = (Agendadores || []).reduce((acc, user) => {
    acc[user.id] = user.name;
    return acc;
  }, {} as Record<string, string>);

  const estadisticas = useMemo(() => generarEstadisticas(agendadosFiltered, usuariosMap), [agendadosFiltered]);

  const AnoSemana = `${getYear(new Date()).toString().replace("20", "")}${getWeek(new Date())}`;
  const pendingSchedules = (Agendados || []).length;
  const completedSchedules = (Agendados || []).filter((agendado) => agendado.anoSemana === AnoSemana).length;

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatCard
              borderColorClass="border-l-blue-500"
              icon={<Clock className="h-4 w-4 text-blue-500" />}
              title="Agendados"
              value={pendingSchedules}
              description="Eventos por programar"
            />
            <StatCard
              borderColorClass="border-l-green-500"
              icon={<CheckCircle className="h-4 w-4 text-green-500" />}
              title="Agendados esta semana"
              value={completedSchedules}
              description={`Semana: ${AnoSemana}`}
            />
          </>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {loading ? (
          <>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </>
        ) : (
          <>
            <div className="">
              <ExtendedRechartCard
                title="Agendados por Semana"
                description="Cantidad de eventos agendados por semana"
                data={estadisticas.porSemana}
                type="bar"
                dataKey="total"
                nameKey="week"
                colors={COLORS}
              />
            </div>
            <ExtendedRechartCard
                title="Distribucion por Horario"
                description="Horarios de clases mas comunes"
                data={estadisticas.porHorario}
                type="pie"
                dataKey="total"
                nameKey="horario"
                colors={COLORS}
              />
              <ExtendedRechartCard
                title="Distribucion por Horario"
                description="Horarios de clases mas comunes"
                data={estadisticas.porTipo}
                type="pie"
                dataKey="total"
                nameKey="tipo"
                colors={COLORS}
              />
              <ExtendedRechartCard
                title="Distribucion por Horario"
                description="Horarios de clases mas comunes"
                data={estadisticas.porEdad}
                type="pie"
                dataKey="total"
                nameKey="tipo"
                colors={COLORS}
              />
          </>
        )}
      </div>
    </div>
  );
}

