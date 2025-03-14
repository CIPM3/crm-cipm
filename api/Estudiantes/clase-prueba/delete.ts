import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const deleteStudent = async (id: string): Promise<void> => {
    const studentDocRef = doc(db, DB_COLLECCTIONS.CLASE_PRUEBA, id);
    await deleteDoc(studentDocRef);
};