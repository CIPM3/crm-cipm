import { Instructor, ScheduleData } from "@/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { InstructorChip } from "@/components/schedule/schedule-comps/instructor-chips";
import { InstructorSelector } from "@/components/schedule/schedule-comps/instructor-selector";

export const DayScheduleTable = ({
    day,
    hours,
    schedule,
    instructors,
    onAddInstructor,
    onRemoveInstructor
  }: {
    day: { id: string, name: string },
    hours: string[],
    schedule: ScheduleData,
    instructors: Instructor[],
    onAddInstructor: (hour: string, instructorId: string) => void,
    onRemoveInstructor: (hour: string, instructorId: string) => void
  }) => (
    <div key={day.id} className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">{day.name}</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hora</TableHead>
            <TableHead>Instructores Asignados</TableHead>
            <TableHead>Agregar Instructor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hours.map(hour => (
            <TableRow key={`${day.id}-${hour}`}>
              <TableCell className="font-medium">{hour}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {schedule[day.id][hour].instructors.map(instructor => (
                    <InstructorChip
                      key={`${day.id}-${hour}-${instructor.id}`}
                      instructor={instructor}
                      onRemove={() => onRemoveInstructor(hour, instructor.id)}
                    />
                  ))}
                  {schedule[day.id][hour].instructors.length === 0 && (
                    <span className="text-gray-400">Sin asignar</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <InstructorSelector
                  instructors={instructors}
                  assignedInstructors={schedule[day.id][hour].instructors}
                  onSelect={(value) => onAddInstructor(hour, value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );