import { ScheduleData } from "@/types";
import { useGetInstructores } from "../usuarios/useGetInstructores";
import { useSchedule } from "./useSchedule";
import { DAYS, HOURS } from "@/components/schedule/Schedule-profesores";
import { toast } from "@/components/ui/use-toast";

export const useScheduleManager = () => {
    const { Instructores, loading: loadingInstructors } = useGetInstructores();
    const { schedule, setSchedule, loading, error, saveSchedule } = useSchedule();
  
    const validInstructores = Instructores.filter(
      instructor => instructor.id && instructor.id.trim() !== ''
    );
  
    const transformSchedule = (): ScheduleData => {
      const result: ScheduleData = {};
      
      DAYS.forEach(day => {
        result[day.id] = {};
        HOURS.forEach(hour => {
          if (schedule[day.id]?.[hour]) {
            if (Array.isArray(schedule[day.id][hour])) {
              result[day.id][hour] = {
                instructors: schedule[day.id][hour].map((id: string) => {
                  const instructor = validInstructores.find(i => i.id === id);
                  return {
                    id,
                    name: instructor?.name || 'Instructor no encontrado'
                  };
                })
              };
            } else {
              const instructor = validInstructores.find(i => i.id === schedule[day.id][hour]);
              result[day.id][hour] = {
                instructors: instructor ? [
                  { id: instructor.id, name: instructor.name }
                ] : []
              };
            }
          } else {
            result[day.id][hour] = { instructors: [] };
          }
        });
      });
      
      return result;
    };
  
    const addInstructor = (day: string, hour: string, instructorId: string) => {
      const instructor = validInstructores.find(i => i.id === instructorId);
      if (!instructor) return;
  
      setSchedule(prev => {
        const newSchedule = { ...prev };
        
        if (!newSchedule[day]) newSchedule[day] = {};
        if (!newSchedule[day][hour]) newSchedule[day][hour] = [];
        
        if (typeof newSchedule[day][hour] === 'string') {
          newSchedule[day][hour] = [newSchedule[day][hour]];
        }
        
        if (!newSchedule[day][hour].includes(instructorId)) {
          newSchedule[day][hour] = [...newSchedule[day][hour], instructorId];
        }
        
        return newSchedule;
      });
    };
  
    const removeInstructor = (day: string, hour: string, instructorId: string) => {
      setSchedule(prev => {
        const newSchedule = { ...prev };
        
        if (newSchedule[day]?.[hour]) {
          if (typeof newSchedule[day][hour] === 'string') {
            newSchedule[day][hour] = [newSchedule[day][hour]];
          }
          
          newSchedule[day][hour] = newSchedule[day][hour].filter((id: string) => id !== instructorId);
        }
        
        return newSchedule;
      });
    };
  
    const handleSave = async () => {
      const success = await saveSchedule(schedule);
      if (success) {
        toast({ title: 'Horario guardado', variant: 'default' });
      } else {
        toast({ title: 'Error al guardar', variant: 'destructive' });
      }
    };
  
    return {
      loading: loading || loadingInstructors,
      error,
      validInstructores,
      currentSchedule: transformSchedule(),
      addInstructor,
      removeInstructor,
      handleSave
    };
  };