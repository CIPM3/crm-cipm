import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FormacionDataType } from "@/types";
import { DB_COLLECCTIONS } from "@/lib/constants";

export const getAllStudentsFormacion = async (): Promise<FormacionDataType[]> => {
    const studentsCollectionRef = collection(db, DB_COLLECCTIONS.FORMACION_GRUPO);
    const studentsSnapshot = await getDocs(studentsCollectionRef);
    const studentsList = studentsSnapshot.docs.map(doc => doc.data() as FormacionDataType);
    return studentsList;
};