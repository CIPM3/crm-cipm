import { useState } from "react";
import { updateStudent } from "@/api/Estudiantes/Agendador/update";
import { ClasePrubeaAgendadorType } from "@/types";

export const useUpdateAgendado = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<{ id: string } | null>(null);

  const mutate = async (id: string, updateData: Partial<ClasePrubeaAgendadorType>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateStudent(id, updateData);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al actualizar agendado:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};