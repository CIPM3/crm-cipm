import { useState } from "react";
import { deleteInstructor } from "@/api/Estudiantes/Instructores/delete";

// Hook para usar la mutación de eliminación
export const useDeleteStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [data, setData] = useState<{ id: string } | null>(null);

  const mutate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteInstructor(id);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al eliminar instructor:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};