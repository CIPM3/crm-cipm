import { useState } from "react";
import { deleteUser } from "@/api/Usuarios/delete";

export const useDeleteUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<{ id: string } | null>(null);

  const mutate = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteUser(userId);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al eliminar usuario:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};