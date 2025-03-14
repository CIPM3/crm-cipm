import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ClasePrubeaType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const getAllStudents = async (): Promise<ClasePrubeaType[]> => {
    const studentsCollectionRef = collection(db, DB_COLLECCTIONS.CLASE_PRUEBA);
    const studentsSnapshot = await getDocs(studentsCollectionRef);
    const studentsList = studentsSnapshot.docs.map(doc => doc.data() as ClasePrubeaType);
    return studentsList;
};