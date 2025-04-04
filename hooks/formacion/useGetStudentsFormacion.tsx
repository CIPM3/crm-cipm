import { useState, useEffect, useCallback } from "react";
import { FormacionDataType } from "@/types";
import { getAllStudentsFormacion } from "@/api/Estudiantes/Formacion/get";


export const useGetFormacionStudents = () => {
  const [FormacionData, setStudents] = useState<FormacionDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllStudentsFormacion();
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

  return { FormacionData, loading, error, refetch: fetchUsuarios };
}