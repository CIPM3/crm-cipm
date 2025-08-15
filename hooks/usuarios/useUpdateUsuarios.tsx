import { useState } from "react";
import { updateUser } from "@/api/Usuarios/update";
import { UpdateUserData, UsersType } from "@/types";

export const useUpdateUsuarios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<UsersType | null>(null);

  const mutate = async (updateData: UpdateUserData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateUser(updateData);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al actualizar usuario:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};