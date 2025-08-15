import { useState, useEffect, useCallback } from "react";
import { getAllInstructors } from "@/api/Estudiantes/Instructores/get";
import { ClasePrubeaType } from "@/types";

export const useGetEstudiantes = () => {
  const [data, setData] = useState<ClasePrubeaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllInstructors();
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
