import { useState } from "react";
import { deleteStudent } from "@/api/Estudiantes/Instructores/delete";

// Hook para usar la mutación de eliminación
export const useDeleteStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteStudent(id);
      console.log("Estudiante eliminado con éxito");
    } catch (err) {
      setError(err as Error);
      console.error("Error al eliminar estudiante:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};