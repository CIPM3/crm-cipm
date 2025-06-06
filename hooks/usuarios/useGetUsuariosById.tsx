import { useState, useEffect, useCallback } from "react";
import { getUserById } from "@/api/Usuarios/getById";
import { UsersType } from "@/types";

export const useGetUsuarioById = (id: string) => {
  const [usuario, setUsuario] = useState<UsersType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsuario = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserById(id);
      setUsuario(response);
    } catch (err) {
      setError(err as Error);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchUsuario();
  }, [id, fetchUsuario]);

  return { usuario, loading, error, refetch: fetchUsuario };
};