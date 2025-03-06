import { queryOptions } from '@tanstack/react-query'
import { DB_COLLECCTIONS } from '@/lib/constants';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Get = queryOptions({
    queryKey: [DB_COLLECCTIONS.PRUEBA],
    queryFn: async () => {
        try {
            // Obtener los documentos de la colección
            const querySnapshot = await getDocs(collection(db, DB_COLLECCTIONS.PRUEBA));
            
            // Mapear los documentos a un array de objetos
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
    
            // Devolver los datos
            return data;
        } catch (error) {
            console.error("Firebase Error: " + DB_COLLECCTIONS.PRUEBA, error);
            throw error; // Opcional: lanzar el error para manejarlo en el componente que llama a esta función
        }
    },
})
