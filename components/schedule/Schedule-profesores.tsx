"use client"

import { Button } from '@/components/ui/button';
import { DayScheduleTable } from '../table/day-schedule-table';
import { useScheduleManager } from '@/hooks/schedule/useScheduleManager';

// Constantes
export const DAYS = [
  { id: 'monday', name: 'Lunes' },
  { id: 'tuesday', name: 'Martes' },
  { id: 'wednesday', name: 'Miércoles' },
  { id: 'thursday', name: 'Jueves' },
  { id: 'friday', name: 'Viernes' },
  { id: 'saturday', name: 'Sábado' }
];

export const HOURS = [
  '8:00 AM','9:00 AM','10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
];

// Componente principal
export function ScheduleEditor() {
  const {
    loading,
    error,
    validInstructores,
    currentSchedule,
    addInstructor,
    removeInstructor,
    handleSave
  } = useScheduleManager();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center">
        <h2 className="text-2xl font-bold">Asignación de Horarios</h2>
        <Button className='w-full lg:w-fit ml-auto' onClick={handleSave}>Guardar Cambios</Button>
      </div>

      <div className="space-y-6">
        {DAYS.map(day => (
          <DayScheduleTable
            key={day.id}
            day={day}
            hours={HOURS}
            schedule={currentSchedule}
            instructors={validInstructores}
            onAddInstructor={(hour, instructorId) => 
              addInstructor(day.id, hour, instructorId)
            }
            onRemoveInstructor={(hour, instructorId) => 
              removeInstructor(day.id, hour, instructorId)
            }
          />
        ))}
      </div>
    </div>
  );
}