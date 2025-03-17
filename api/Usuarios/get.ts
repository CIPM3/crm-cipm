import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UsersType } from '@/types';
import { DB_COLLECCTIONS } from '@/lib/constants';

export const getUsers = async (): Promise<UsersType[]> => {
    try {
        // Obtener los documentos de la colección
        const querySnapshot = await getDocs(collection(db, DB_COLLECCTIONS.USUARIOS));
        
        // Mapear los documentos a un array de objetos
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Devolver los datos
        return data as UsersType[];
    } catch (error) {
        console.error("Firebase Error: " + DB_COLLECCTIONS.USUARIOS, error);
        throw error; // Opcional: lanzar el error para manejarlo en el componente que llama a esta función
    }
};