import { doc, setDoc, getDoc } from 'firebase/firestore'; // Ajusta según tu base de datos
import { db } from '@/lib/firebase'; // Asegúrate de exportar `db` en tu configuración de Firebase
import { DB_COLLECCTIONS } from '@/lib/constants';
import { auth } from '@/lib/firebase'; // Ajusta la ruta según tu estructura
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { UsersType } from '@/types';

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();

    // Iniciar sesión con Google
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verificar si el usuario ya existe en la base de datos
    const userDocRef = doc(db, DB_COLLECCTIONS.USUARIOS, user.uid);
    const userDoc = await getDoc(userDocRef);

    let userData ;

    if (userDoc.exists()) {
        // Si el usuario existe, usa los datos de la base de datos
        userData = userDoc.data() as UsersType ;
    } else {
        // Si el usuario no existe, crea un nuevo documento en la base de datos
        userData = {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            avatar: user.photoURL,
            role: 'cliente',
            createdAt: new Date().toISOString(),
        } as UsersType
        await setDoc(userDocRef, userData);
    }

    return userData; // Devuelve los datos del usuario (de la base de datos o recién creados)
};