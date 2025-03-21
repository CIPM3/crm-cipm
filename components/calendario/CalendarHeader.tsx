import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalendarHeaderProps {
  currentDate: Date
  weekDates: Date[]
  view: "day" | "week"
  filterType: string
  filterMember: string
  setView: (view: "day" | "week") => void
  setFilterType: (filterType: string) => void
  setFilterMember: (filterMember: string) => void
  goToToday: () => void
  prevWeek: () => void
  nextWeek: () => void
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  weekDates,
  view,
  filterType,
  filterMember,
  setView,
  setFilterType,
  setFilterMember,
  goToToday,
  prevWeek,
  nextWeek,
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>

          <Select value={view} onValueChange={setView}>
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
  )
}