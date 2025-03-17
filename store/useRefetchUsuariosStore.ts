import { RefetchState } from "@/types";
import {create} from "zustand";


export const useRefetchUsuariosStore = create<RefetchState>((set) => ({
  shouldRefetch: false,
  triggerRefetch: () => set({ shouldRefetch: true }),
  resetRefetch: () => set({ shouldRefetch: false }),
}));