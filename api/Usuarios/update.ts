import { doc, updateDoc } from "firebase/firestore";
import { UsersType } from "@/types"; // Asegúrate de importar el tipo UsersType
import { DB_COLLECCTIONS, ROLES } from "@/lib/constants";
import { db } from "@/lib/firebase";
import { useMutation } from "@tanstack/react-query";


// Definir el tipo de los datos de actualización
interface UpdateUserData {
  id: string; // ID del usuario a actualizar
  name?: string;
  email?: string;
  role?: typeof ROLES[number];
  avatar?: string;
}

// Función para actualizar el usuario
const updateUser = async ({ id, ...userData }: UpdateUserData): Promise<UsersType> => {
  try {
    // Referencia al documento del usuario en Firestore
    const userDocRef = doc(db, DB_COLLECCTIONS.USUARIOS, id);

    // Actualizar el documento
    await updateDoc(userDocRef, userData);

    // Devolver los datos actualizados
    return { id, ...userData } as UsersType;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};

export const useUpdateUser = () => {
  return useMutation<UsersType, Error, UpdateUserData>({
    mutationFn: updateUser, // Pasar la función de mutación aquí
    onSuccess: (user) => {
      console.log("Usuario actualizado con éxito:", user);
    },
    onError: (error) => {
      console.error("Error al actualizar el usuario:", error);
    },
  });
};