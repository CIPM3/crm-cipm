import { CalendarEvent as CalendarEventType } from "@/types"
import InfoClaseDialog from "../dialog/calendario/info-clase-dialog"

interface CalendarModalProps {
  selectedEvent: CalendarEventType | null
  setSelectedEvent: (event: CalendarEventType | null) => void
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ selectedEvent, setSelectedEvent }) => {
  return (
    selectedEvent && (
      <InfoClaseDialog
        open={selectedEvent !== null}
        setOpen={() => setSelectedEvent(null)}
        data={selectedEvent!!}
      />
    )
  )
}