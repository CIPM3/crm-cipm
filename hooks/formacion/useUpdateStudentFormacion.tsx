import { useState } from "react";
import { FormacionDataType } from "@/types";
import { updateFormacionStudent } from "@/api/Estudiantes/Formacion/update";

export const useUpdateFormacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<{ id: string } | null>(null);

  const mutate = async (id: string, updateData: Partial<FormacionDataType>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateFormacionStudent(id, updateData);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error("Error al actualizar estudiante de formación:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};