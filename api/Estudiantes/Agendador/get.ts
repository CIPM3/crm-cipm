import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ClasePrubeaAgendadorType, ClasePrubeaType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const getAllStudents = async (): Promise<ClasePrubeaAgendadorType[]> => {
    const studentsCollectionRef = collection(db, DB_COLLECCTIONS.AGENDADOR);
    const studentsSnapshot = await getDocs(studentsCollectionRef);
    const studentsList = studentsSnapshot.docs.map(doc => doc.data() as ClasePrubeaAgendadorType);
    return studentsList;
};