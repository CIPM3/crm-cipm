import { useState } from "react";
import { FormacionDataType } from "@/types"; // Asegúrate de importar el tipo UsersType
import { updateStudent } from "@/api/Estudiantes/Formacion/update";

// Hook para usar la mutación de actualización
export const useUpdateUsuariosFormacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (data: FormacionDataType) => {
    setLoading(true);
    setError(null);
    try {
      const user = updateStudent(data.id!!,data)
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