import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FormacionDataType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const updateStudent = async (id: string, estudiante: Partial<FormacionDataType>): Promise<void> => {
  const studentDocRef = doc(db, DB_COLLECCTIONS.FORMACION_GRUPO, id);
  await updateDoc(studentDocRef, estudiante);
};