import { deleteStudent } from "@/api/Estudiantes/Formacion/delete";
import { useState } from "react";

// Hook para usar la mutación de eliminación
export const useDeleteUsuarioFormacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteStudent(userId);
      console.log("Usuario eliminado con éxito");
    } catch (err) {
      setError(err as Error);
      console.error("Error al eliminar el usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};