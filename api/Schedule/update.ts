import { DB_COLLECCTIONS } from "@/lib/constants";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const updateSchedule = async (scheduleData: Record<string, any>) => {
    try {
        await setDoc(doc(db, DB_COLLECCTIONS.HORARIO, 'current'), {
            ...scheduleData,
            lastUpdated: new Date()
        });
        return true;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
};