import { create } from "zustand";

export const useLoadingStore = create((set) => ({
  isLoading: true,
  setIsLoading: (value) => set(() => ({ isLoading: value })),
}));
