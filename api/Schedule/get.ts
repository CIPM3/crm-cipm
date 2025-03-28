import { DB_COLLECCTIONS } from "@/lib/constants";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const days = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' }
];

export const getSchedule = async () => {
    try {
        const docRef = doc(db, DB_COLLECCTIONS.HORARIO, 'current');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // Crear estructura inicial si no existe
            const initialSchedule = days.reduce((acc, day) => {
                acc[day.id] = {};
                return acc;
            }, {} as Record<string, any>);

            await setDoc(docRef, initialSchedule);
            return initialSchedule;
        }
    } catch (error) {
        console.error('Error getting schedule:', error);
        throw error;
    }
};