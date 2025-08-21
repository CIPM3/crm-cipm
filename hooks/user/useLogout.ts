// hooks/useLogout.ts
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const { clearUser } = useAuthStore();
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth); // Cierra la sesión en Firebase Auth
      clearUser(); // Limpia la store
      
      // Clear auth cookie explicitly
      document.cookie = `auth-storage=; Path=/; Max-Age=0; SameSite=Lax`;
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return logout;
};