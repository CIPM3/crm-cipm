import { updateItem, fetchItem } from "@/lib/firebaseService";
import { UpdateUserData, UsersType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const updateUser = async ({ id, ...userData }: UpdateUserData): Promise<UsersType> => {
  try {
    // Validaciones básicas
    if (!id || typeof id !== 'string') {
      throw new Error('ID del usuario inválido');
    }

    if (Object.keys(userData).length === 0) {
      throw new Error('No hay datos para actualizar');
    }

    // Filtrar campos undefined/null
    const cleanUserData = Object.fromEntries(
      Object.entries(userData).filter(([_, value]) => value !== undefined && value !== null)
    );

    if (Object.keys(cleanUserData).length === 0) {
      throw new Error('Todos los datos de actualización son inválidos');
    }

    // Realizar la actualización
    await updateItem<UsersType>(DB_COLLECCTIONS.USUARIOS, id, cleanUserData);
    
    // Obtener y retornar los datos actualizados
    const updatedUser = await fetchItem<UsersType>(DB_COLLECCTIONS.USUARIOS, id);
    
    if (!updatedUser) {
      throw new Error('No se pudo obtener el usuario actualizado');
    }

    return updatedUser;
  } catch (error) {
    console.error('Error en updateUser:', {
      error,
      id,
      userData,
      timestamp: new Date().toISOString()
    });
    throw error instanceof Error ? error : new Error('Error desconocido al actualizar usuario');
  }
};