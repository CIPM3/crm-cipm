import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore"; // Importa la store
import { LoginUserData } from "@/types"; 
import { loginUser } from "@/api/auth/login";


export const useLoginUser = () => {
  const { setUser } = useAuthStore(); // Usa la store para actualizar el estado del usuario
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = async (data: LoginUserData) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(data);
      setUser(user); // Actualiza la store con la información del usuario
    } catch (err) {
      setError(err as Error);
      console.error("Error al iniciar sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};