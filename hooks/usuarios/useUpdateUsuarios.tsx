import { useState } from "react";
import { updateUser } from "@/api/Usuarios/update";
import { UpdateUserData } from "@/types"; // Asegúrate de importar el tipo UsersType

// Hook para usar la mutación de actualización
export const useUpdateUsuarios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (data: UpdateUserData) => {
    setLoading(true);
    setError(null);
    try {
      const user = await updateUser(data);
      return user;
    } catch (err) {
      setError(err as Error);
      console.error("Error al actualizar el usuario:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};