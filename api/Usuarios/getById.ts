import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UsersType } from '@/types';
import { DB_COLLECCTIONS } from '@/lib/constants';

// ...existing code...

export const getUserById = async (id: string): Promise<UsersType | null> => {
    try {
        const docRef = doc(db, DB_COLLECCTIONS.USUARIOS, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as UsersType;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Firebase Error: getUserById (${id})`, error);
        throw error;
    }
};