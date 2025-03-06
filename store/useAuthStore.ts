// stores/useAuthStore.ts
import { AuthState } from "@/types/StoreTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useAuthStore = create(
    persist<AuthState>(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      {
        name: "auth-storage", // Nombre de la clave en localStorage
      }
    )
  );