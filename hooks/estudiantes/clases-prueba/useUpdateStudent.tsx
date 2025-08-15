import { useState } from "react";
import { updateInstructor } from "@/api/Estudiantes/Instructores/update";
import { ClasePrubeaType } from "@/types";

// Hook para usar la mutación de actualización
export const useUpdateStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [data, setData] = useState<{ id: string } | null>(null);

  const mutate = async (id: string, estudiante: Partial<ClasePrubeaType>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateInstructor(id, estudiante);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al actualizar instructor:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};