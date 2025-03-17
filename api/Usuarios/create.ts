import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { RegisterUserData, UsersType } from "@/types"; // Asegúrate de importar el tipo UsersType
import { DB_COLLECCTIONS, ROLES } from "@/lib/constants";

export const createUser = async ({ name, email, password, role }: RegisterUserData): Promise<UsersType> => {
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
    role, // Usar el rol proporcionado
    avatar: "", // Asegúrate de que este valor coincida con el tipo UsersType
    createdAt: new Date().toISOString(),
  };

  // Crear el documento del usuario en Firestore
  const userDocRef = doc(db, DB_COLLECCTIONS.USUARIOS, user.uid);
  await setDoc(userDocRef, UserData);

  return UserData;
};