import { deleteFormacionStudent } from "@/api/Estudiantes/Formacion/delete";
import { useState } from "react";

export const useDeleteFormacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<{ id: string } | null>(null);

  const mutate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteFormacionStudent(id);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al eliminar estudiante de formación:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};