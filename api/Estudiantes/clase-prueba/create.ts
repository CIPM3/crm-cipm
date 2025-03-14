import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ClasePrubeaType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";
import { v4 as uuidv4 } from 'uuid';

// Función para registrar el usuario
export const createStudent = async (estudiante: ClasePrubeaType): Promise<ClasePrubeaType> => {
  // Generar un ID único para el documento si no se proporciona uno
  const id = estudiante.id || uuidv4();
  const studentDocRef = doc(db, DB_COLLECCTIONS.CLASE_PRUEBA, id);
  await setDoc(studentDocRef, { ...estudiante, id });

  return { ...estudiante, id };
};