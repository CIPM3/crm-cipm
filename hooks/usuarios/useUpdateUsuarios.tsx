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
      // Validaciones previas
      if (!updateData.id) {
        throw new Error('ID del usuario es requerido');
      }
      
      if (updateData.email && !/\S+@\S+\.\S+/.test(updateData.email)) {
        throw new Error('Email no tiene un formato válido');
      }
      
      const result = await updateUser(updateData);
      
      if (!result) {
        throw new Error('La operación de actualización no retornó datos');
      }
      
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido al actualizar usuario');
      setError(error);
      console.error("Error al actualizar usuario:", {
        originalError: err,
        updateData,
        timestamp: new Date().toISOString()
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};