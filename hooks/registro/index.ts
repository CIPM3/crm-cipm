// hooks/useRegisterUser.ts
import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore"; // Importa la store
import { UsersType } from "@/types"; // Asegúrate de importar el tipo UsersType
import { DB_COLLECCTIONS } from "@/lib/constants";

// Definir el tipo de los datos de registro
interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

// Función para registrar el usuario
const registerUser = async ({ name, email, password }: RegisterUserData): Promise<UsersType> => {
  // Crear usuario en Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Actualizar el perfil del usuario con el nombre
  await updateProfile(user, { displayName: name });

  // Crear el objeto UserData
  const UserData: UsersType = {
    id: user.uid,
    name,
    email,
    role: "cliente", // Asegúrate de que este valor coincida con el tipo UsersType
    avatar: "", // Asegúrate de que este valor coincida con el tipo UsersType
    createdAt: new Date().toISOString(),
  };

  // Crear el documento del usuario en Firestore
  const userDocRef = doc(db, DB_COLLECCTIONS.USUARIOS, user.uid);
  await setDoc(userDocRef, UserData);

  return UserData;
};

// Hook para usar la mutación de registro
export const useRegisterUser = () => {
  const { setUser } = useAuthStore(); // Usa la store para actualizar el estado del usuario

  return useMutation<UsersType, Error, RegisterUserData>({
    mutationFn: registerUser, // Pasar la función de mutación aquí
    onSuccess: (user) => {
      console.log("Usuario registrado con éxito:", user);
      setUser(user); // Actualiza la store con la información del usuario
    },
    onError: (error) => {
      console.error("Error al registrar usuario:", error);
    },
  });
};