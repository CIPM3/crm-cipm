import { useState } from "react";
import { registerUser } from "@/api/auth/register";
import { useAuthStore } from "@/store/useAuthStore"; // Importa la store
import { RegisterUserData } from "@/types"; // Asegúrate de importar el tipo UsersType

// Hook para usar la mutación de registro
export const useRegisterUser = () => {
  const { setUser } = useAuthStore(); // Usa la store para actualizar el estado del usuario
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const register = async (data: RegisterUserData) => {
    setLoading(true);
    setError(null);
    try {
      const user = await registerUser(data);
      setUser(user); // Actualiza la store con la información del usuario
    } catch (err) {
      setError(err as Error);
      console.error("Error al registrar usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};