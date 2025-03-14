import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ClasePrubeaType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const updateStudent = async (id: string, estudiante: Partial<ClasePrubeaType>): Promise<void> => {
  const studentDocRef = doc(db, DB_COLLECCTIONS.CLASE_PRUEBA, id);
  await updateDoc(studentDocRef, estudiante);
};