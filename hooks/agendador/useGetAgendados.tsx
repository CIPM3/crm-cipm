import { useState, useEffect, useCallback } from "react";
import { getAllStudents } from "@/api/Estudiantes/Agendador/get";
import { ClasePrubeaAgendadorType } from "@/types";

export const useGetAgendados = () => {
  const [Usuarios, setUsuarios] = useState<ClasePrubeaAgendadorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllStudents();
      setUsuarios(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return { Usuarios, loading, error, refetch: fetchUsuarios };
};