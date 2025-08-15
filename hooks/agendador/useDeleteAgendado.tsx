import { useState } from "react";
import { deleteStudent } from "@/api/Estudiantes/Agendador/delete";

export const useDeleteAgendado = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<{ id: string } | null>(null);

  const mutate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteStudent(id);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al eliminar agendado:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};