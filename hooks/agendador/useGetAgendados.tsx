import { useState, useEffect, useCallback } from "react";
import { getAllStudents } from "@/api/Estudiantes/Agendador/get";
import { ClasePrubeaAgendadorType } from "@/types";

export const useGetAgendados = () => {
  const [data, setData] = useState<ClasePrubeaAgendadorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllStudents();
      setData(response);
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};