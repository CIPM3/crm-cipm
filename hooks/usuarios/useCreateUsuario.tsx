import { useState } from "react";
import { createUser } from "@/api/Usuarios/create";
import { RegisterUserData, UsersType } from "@/types";

export const useCreateUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<UsersType | null>(null);

  const mutate = async (userData: RegisterUserData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUser(userData);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al crear usuario:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};