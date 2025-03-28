"use client"

import { useState, useEffect } from "react"
import { CalendarEvent, ClasePrubeaAgendadorType, ClasePrubeaType, EventStatus } from "@/types"
import { CalendarHeader } from "./CalendarHeader"
import { CalendarBody } from "./CalendarBody"
import { CalendarModal } from "./CalendarModal"

// Función para generar fechas de la semana (igual que tu versión original)
const getWeekDates = (date: Date): Date[] => {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
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
  estudiantes: ClasePrubeaAgendadorType[]
}

export function Calendar({ estudiantes }: Props) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week">("week")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterMember, setFilterMember] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    const mappedEvents: CalendarEvent[] = estudiantes.map((estudiante) => {
      // Asegurar que el nivel no sea undefined
      const nivel = estudiante.nivel || "" // Valor por defecto si es undefined
      
      // Convertir fecha de Firebase a Date
      const fecha = estudiante.diaClasePrueba?.seconds 
        ? new Date(estudiante.diaClasePrueba.seconds * 1000) 
        : new Date() // Fallback a fecha actual

      return {
        id: estudiante.id || Math.random().toString(),
        title: estudiante.nombreAlumno,
        date: fecha,
        status: "scheduled" as EventStatus,
        type: "class",
        studentName: estudiante.nombreAlumno,
        level: nivel, // Ahora siempre es string
        time: estudiante.horaClasePrueba,
        additionalInfo: estudiante.observaciones || "", // Valor por defecto
        anoSemana:estudiante.anoSemana
      }
    })

    setEvents(mappedEvents)
  }, [estudiantes])

  const weekDates = getWeekDates(currentDate)

  const navigation = {
    prevWeek: () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7))),
    nextWeek: () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7))),
    goToToday: () => setCurrentDate(new Date())
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
        {...navigation}
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