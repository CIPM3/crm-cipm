import { useState } from "react";
import { createStudent } from "@/api/Estudiantes/Agendador/create";
import { ClasePrubeaAgendadorType } from "@/types";

export const useCreateAgendado = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ClasePrubeaAgendadorType | null>(null);

  const mutate = async (studentData: ClasePrubeaAgendadorType) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createStudent(studentData);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al crear agendado:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};