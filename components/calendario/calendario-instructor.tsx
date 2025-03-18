"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import InfoClaseDialog from "../dialog/calendario/info-clase-dialog"
import { CalendarEvent, ClasePrubeaType, EventStatus } from "@/types"

// Función para generar fechas de la semana
const getWeekDates = (date: Date): Date[] => {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Ajustar cuando el día es domingo
  const monday = new Date(date)
  monday.setDate(diff)

  const weekDates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday)
    currentDate.setDate(monday.getDate() + i)
    weekDates.push(currentDate)
  }

  return weekDates
}

// Función para formatear la hora
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

interface Props {
  estudiantes: ClasePrubeaType[]
}

// Componente principal del calendario
export function Calendar({ estudiantes }: Props) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week">("week");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterMember, setFilterMember] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Mapear estudiantes a eventos
  useEffect(() => {
    const mappedEvents = estudiantes.map((estudiante) => ({
      id: estudiante.id || "",
      title: estudiante.nombreAlumno,
      date: new Date(estudiante.fecha.seconds * 1000),
      status: "scheduled" as EventStatus,
      type: "class",
      studentName: estudiante.nombreAlumno,
      level: estudiante.nivel,
      time: estudiante.horario,
      additionalInfo: estudiante.observaciones,
    }));
    setEvents(mappedEvents);
  }, [estudiantes]);

  // Generar las fechas de la semana actual
  const weekDates = getWeekDates(currentDate);

  // Navegar a la semana anterior
  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Navegar a la semana siguiente
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Navegar a la fecha actual
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filtrar eventos por día
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        (filterType === "all" || event.type === filterType)
      );
    });
  };

  // Obtener el nombre del día de la semana
  const getDayName = (date: Date): string => {
    return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
  };

  // Obtener el color de fondo según el estado del evento
  const getEventBgColor = (status: EventStatus): string => {
    switch (status) {
      case "scheduled":
        return "bg-blue-600 hover:bg-blue-700";
      case "missed":
        return "bg-red-100 text-red-800 border-l-4 border-red-500";
      case "late":
        return "bg-amber-100 text-amber-800 border-l-4 border-amber-500";
      case "completed":
        return "bg-green-100 text-green-800 border-l-4 border-green-500";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  // Manejar el clic en un evento
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cabecera del calendario */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoy
            </Button>

            <Select value={view} onValueChange={(value: "day" | "week") => setView(value)}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Vista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Día</SelectItem>
                <SelectItem value="week">Semana</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={prevWeek} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-2 text-sm">
                {weekDates[0].toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })} -
                {weekDates[6].toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
              <Button variant="ghost" size="icon" onClick={nextWeek} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-4 hidden flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filtros:</span>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Todos los eventos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los eventos</SelectItem>
                  <SelectItem value="shift">Turnos</SelectItem>
                  <SelectItem value="meeting">Reuniones</SelectItem>
                  <SelectItem value="task">Tareas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterMember} onValueChange={setFilterMember}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Todos los miembros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los miembros</SelectItem>
                  <SelectItem value="user1">Alex Morgan</SelectItem>
                  <SelectItem value="user2">Sam Taylor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>
      </div>

      {/* Cuerpo del calendario - Vista semanal */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Cabecera de días */}
          <div className="grid grid-cols-7 border-b">
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 text-center border-r last:border-r-0",
                  new Date().toDateString() === date.toDateString() ? "bg-blue-50" : "",
                )}
              >
                <div className="text-xs text-gray-500">{getDayName(date)}</div>
                <div className="text-2xl font-semibold">{date.getDate()}</div>
                <div className="text-xs text-gray-500">{date.toLocaleDateString("es-ES", { month: "short" })}</div>
              </div>
            ))}
          </div>

          {/* Contenido del calendario */}
          <div className="grid grid-cols-7 min-h-[250px]">
            {weekDates.map((date, dateIndex) => (
              <div
                key={dateIndex}
                className={cn(
                  "p-2 border-r last:border-r-0 space-y-2",
                  new Date().toDateString() === date.toDateString() ? "bg-blue-50" : "",
                )}
              >
                {getEventsForDate(date).map((event, eventIndex) => (
                  <div
                    key={`${dateIndex}-${eventIndex}`}
                    className={cn("p-2 rounded text-white text-sm cursor-pointer", getEventBgColor(event.status))}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="font-medium">{event.studentName}</div>
                    <div className="text-xs">
                      {formatTime(event.date)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para mostrar los datos adicionales del evento */}
      {selectedEvent && (
        <InfoClaseDialog
          open={selectedEvent !== null}
          setOpen={() => setSelectedEvent(null)}
          data={selectedEvent!!}
        />
      )}
    </div>
  );
}