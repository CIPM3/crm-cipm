"use client"

import { useState, useEffect } from "react"
import { CalendarEvent, ClasePrubeaType, EventStatus } from "@/types"
import { CalendarHeader } from "./CalendarHeader"
import { CalendarBody } from "./CalendarBody"
import { CalendarModal } from "./CalendarModal"

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

interface Props {
  estudiantes: ClasePrubeaType[]
}

// Componente principal del calendario
export function Calendar({ estudiantes }: Props) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week">("week")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterMember, setFilterMember] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])

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
    }))
    setEvents(mappedEvents)
  }, [estudiantes])

  // Generar las fechas de la semana actual
  const weekDates = getWeekDates(currentDate)

  // Navegar a la semana anterior
  const prevWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  // Navegar a la semana siguiente
  const nextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  // Navegar a la fecha actual
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        weekDates={weekDates}
        view={view}
        filterType={filterType}
        filterMember={filterMember}
        setView={setView}
        setFilterType={setFilterType}
        setFilterMember={setFilterMember}
        goToToday={goToToday}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
      />
      <CalendarBody
        weekDates={weekDates}
        events={events}
        filterType={filterType}
        onEventClick={setSelectedEvent}
      />
      <CalendarModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
    </div>
  )
}