// hooks/useLogout.ts
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { signOut } from "firebase/auth";

export const useLogout = () => {
  const { clearUser } = useAuthStore();

  const logout = async () => {
    try {
      await signOut(auth); // Cierra la sesión en Firebase Auth
      clearUser(); // Limpia la store
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return logout;
};