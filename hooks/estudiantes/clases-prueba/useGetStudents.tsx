import { useState, useEffect, useCallback } from "react";
import { getAllStudents } from "@/api/Estudiantes/Instructores/get";
import { ClasePrubeaType } from "@/types";

export const useGetEstudiantes = () => {
  const [Users, setStudents] = useState<ClasePrubeaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllStudents();
      setStudents(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return { Users, loading, error,refetch: fetchUsuarios };
};
