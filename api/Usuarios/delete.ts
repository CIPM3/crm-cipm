import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DB_COLLECCTIONS } from "@/lib/constants";

// Función para eliminar el usuario
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Referencia al documento del usuario en Firestore
    const userDocRef = doc(db, DB_COLLECCTIONS.USUARIOS, userId);

    // Eliminar el documento
    await deleteDoc(userDocRef);

    console.log("Usuario eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
};