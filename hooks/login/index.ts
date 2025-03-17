import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Importa las instancias de auth y db de Firebase
import { useAuthStore } from "@/store/useAuthStore"; // Importa la store
import { UsersType } from "@/types"; // Asegúrate de importar el tipo UsersType
import { DB_COLLECCTIONS } from "@/lib/constants";

interface LoginUserData {
  email: string;
  password: string;
}

const loginUser = async ({ email, password }: LoginUserData): Promise<UsersType> => {
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

export const useLoginUser = () => {
  const { setUser } = useAuthStore(); // Usa la store para actualizar el estado del usuario
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = async (data: LoginUserData) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(data);
      setUser(user); // Actualiza la store con la información del usuario
    } catch (err) {
      setError(err as Error);
      console.error("Error al iniciar sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};