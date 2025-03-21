import { DB_COLLECCTIONS } from "@/lib/constants";
import { auth, db } from "@/lib/firebase";
import { LoginUserData, UsersType } from "@/types";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const loginUser = async ({ email, password }: LoginUserData): Promise<UsersType> => {
    // Iniciar sesión con Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    // Obtener la información adicional del usuario desde Firestore
    const userDocRef = doc(db, DB_COLLECCTIONS.USUARIOS, user.uid);
    const userDoc = await getDoc(userDocRef);
  
    if (!userDoc.exists()) {
      throw new Error("El usuario no existe en Firestore.");
    }
  
    // Devolver la información del usuario
    return userDoc.data() as UsersType;
  };