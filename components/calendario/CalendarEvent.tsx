import { CalendarEvent as CalendarEventType, EventStatus } from "@/types"
import { cn } from "@/lib/utils"

interface CalendarEventProps {
  event: CalendarEventType
  onClick: (event: CalendarEventType) => void
}

const getEventBgColor = (status: EventStatus): string => {
  switch (status) {
    case "scheduled":
      return "bg-blue-600 hover:bg-blue-700"
    case "missed":
      return "bg-red-100 text-red-800 border-l-4 border-red-500"
    case "late":
      return "bg-amber-100 text-amber-800 border-l-4 border-amber-500"
    case "completed":
      return "bg-green-100 text-green-800 border-l-4 border-green-500"
    default:
      return "bg-blue-600 hover:bg-blue-700"
  }
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({ event, onClick }) => {
  return (
    <div
      className={cn("p-2 rounded text-white text-sm cursor-pointer", getEventBgColor(event.status))}
      onClick={() => onClick(event)}
    >
      <div className="font-medium">{event.studentName}</div>
      <div className="text-xs">
        {event.time}
      </div>
    </div>
  )
}