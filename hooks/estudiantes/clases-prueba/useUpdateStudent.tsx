import { useState } from "react";
import { updateStudent } from "@/api/Estudiantes/clase-prueba/update";
import { ClasePrubeaType } from "@/types";

// Hook para usar la mutación de actualización
export const useUpdateStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, estudiante: Partial<ClasePrubeaType>) => {
    setLoading(true);
    setError(null);
    try {
      await updateStudent(id, estudiante);
      console.log("Estudiante actualizado correctamente");
    } catch (err) {
      setError(err as Error);
      console.error("Error al actualizar estudiante:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};