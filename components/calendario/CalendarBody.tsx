import { CalendarEvent as CalendarEventType } from "@/types"
import { CalendarEvent } from "./CalendarEvent"
import { cn } from "@/lib/utils"

interface CalendarBodyProps {
  weekDates: Date[]
  events: CalendarEventType[]
  filterType: string
  onEventClick: (event: CalendarEventType) => void
}

const getEventsForDate = (date: Date, events: CalendarEventType[], filterType: string): CalendarEventType[] => {
  return events.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear() &&
      (filterType === "all" || event.type === filterType)
    )
  })
}

const getDayName = (date: Date): string => {
  return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase()
}

export const CalendarBody: React.FC<CalendarBodyProps> = ({ weekDates, events, filterType, onEventClick }) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Cabecera de días */}
        <div className="grid grid-cols-7 border-b">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={cn(
                "p-2 text-center flex items-center justify-start border-r last:border-r-0",
                new Date().toDateString() === date.toDateString() ? "bg-blue-50" : "",
              )}
            >
              <div className="w-1/2 flex justify-center items-center ">
                <div className={`text-4xl font-semibold mx-auto ${new Date().toDateString() === date.toDateString() ? "text-blue-500" : ""}`}>{date.getDate()}</div>
              </div>
              <div className="w-fit">
                <div className="text-xs text-gray-800 font-bold">{getDayName(date)}</div>
                <div className="text-xs text-gray-500">{date.toLocaleDateString("es-ES", { month: "short" })}</div>
              </div>

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
              {getEventsForDate(date, events, filterType).map((event, eventIndex) => (
                <CalendarEvent
                  key={`${dateIndex}-${eventIndex}`}
                  event={event}
                  onClick={onEventClick}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}