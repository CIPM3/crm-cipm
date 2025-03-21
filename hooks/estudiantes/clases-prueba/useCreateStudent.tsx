import { useState } from "react";
import { createStudent } from "@/api/Estudiantes/Instructores/create";
import { ClasePrubeaType } from "@/types";

// Hook para usar la mutación de registro
export const useCreateStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (studentData: ClasePrubeaType) => {
    setLoading(true);
    setError(null);
    try {
      const student = await createStudent(studentData);
      console.log("Estudiante registrado con éxito:", student);
      return student;
    } catch (err) {
      setError(err as Error);
      console.error("Error al registrar estudiante:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};