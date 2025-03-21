import { useState } from "react";
import { createStudent } from "@/api/Estudiantes/Agendador/create";
import { ClasePrubeaAgendadorType, RegisterUserData } from "@/types"; // Asegúrate de importar el tipo UsersType

// Hook para usar la mutación de registro
export const useCreateUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const register = async (data: ClasePrubeaAgendadorType) => {
    setLoading(true);
    setError(null);
    try {
      const user = await createStudent(data);
      return user;
    } catch (err) {
      setError(err as Error);
      console.error("Error al registrar usuario:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};