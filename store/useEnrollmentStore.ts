import { create } from "zustand"

interface EnrollmentsStore {
  canRefetch: boolean
  setCanRefetch: (value: boolean) => void
}

export const useEnrollmentsStore = create<EnrollmentsStore>((set) => ({
  canRefetch: false,
  setCanRefetch: (value) => set({ canRefetch: value }),
}))