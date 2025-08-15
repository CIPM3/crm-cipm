import { useState, useEffect, useCallback } from "react";
import { getUsers } from "@/api/Usuarios/get";
import { UsersType } from "@/types";

export const useGetAgendadores = () => {
  const [data, setData] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      const agendadores = response.filter((user) => user.role === "agendador");
      setData(agendadores);
      return agendadores;
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