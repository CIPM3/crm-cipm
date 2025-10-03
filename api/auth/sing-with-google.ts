import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DB_COLLECCTIONS } from '@/lib/constants';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, UserCredential } from 'firebase/auth';
import { UsersType } from '@/types';

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    return persistUserFromCredential(result);
};

export const startGoogleRedirect = async () => {
    const googleProvider = new GoogleAuthProvider();
    await signInWithRedirect(auth, googleProvider);
};

export const consumeGoogleRedirectResult = async (): Promise<UsersType | null> => {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    return persistUserFromCredential(result);
};

const persistUserFromCredential = async (result: UserCredential): Promise<UsersType> => {
    const user = result.user;
    const userDocRef = doc(db, DB_COLLECCTIONS.USUARIOS, user.uid);
    const userDoc = await getDoc(userDocRef);

    let userData: UsersType;

    if (userDoc.exists()) {
        // Usuario YA existe - NO sobrescribir, solo leer
        const data = userDoc.data();
        // Map 'rol' to 'role' if it exists (for backwards compatibility)
        userData = {
            ...data,
            id: user.uid,
            role: data.role || data.rol || 'cliente',
        } as UsersType;

        console.log('✅ Usuario existente encontrado:', {
            id: userData.id,
            email: userData.email,
            role: userData.role
        });
    } else {
        // Usuario NUEVO - crear con rol 'cliente'
        userData = {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            avatar: user.photoURL,
            role: 'cliente',
            createdAt: new Date().toISOString(),
        } as UsersType;
        await setDoc(userDocRef, userData);
        console.log('✅ Usuario nuevo creado con rol cliente');
    }

    return userData;
};