import { useState } from "react";
import { createInstructor } from "@/api/Estudiantes/Instructores/create";
import { ClasePrubeaType } from "@/types";

// Hook para usar la mutación de registro
export const useCreateStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [data, setData] = useState<ClasePrubeaType | null>(null);

  const mutate = async (studentData: ClasePrubeaType) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createInstructor(studentData);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al registrar instructor:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};