import { useState, useEffect, useCallback } from "react";
import { getUsers } from "@/api/Usuarios/get";
import { UsersType } from "@/types";

export const useGetFormacion = () => {
  const [data, setData] = useState<UsersType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      const formacionUsers = response.filter((user) => user.role === "formacion de grupo");
      setData(formacionUsers);
      return formacionUsers;
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