import { doc, updateDoc } from "firebase/firestore";
import { UpdateUserData, UsersType } from "@/types"; // Asegúrate de importar el tipo UsersType
import { DB_COLLECCTIONS } from "@/lib/constants";
import { db } from "@/lib/firebase";

export const updateUser = async ({ id, ...userData }: UpdateUserData): Promise<UsersType> => {
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