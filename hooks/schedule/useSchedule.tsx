// hooks/schedule/useSchedule.ts
import { getSchedule } from '@/api/Schedule/get';
import { updateSchedule } from '@/api/Schedule/update';
import { useState, useEffect } from 'react';

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const scheduleData = await getSchedule();
      setSchedule(scheduleData);
      setError(null);
    } catch (err) {
      setError('Error cargando horario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveSchedule = async (scheduleData: Record<string, any>) => {
    try {
      setLoading(true);
      await updateSchedule(scheduleData);
      setError(null);
      return true;
    } catch (err) {
      setError('Error guardando horario');
      console.error('Detalles del error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  return {
    schedule,
    setSchedule,
    loading,
    error,
    saveSchedule,
    refresh: loadSchedule
  };
};