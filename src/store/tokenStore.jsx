import { create } from "zustand";

export const useTokenStore = create((set) => ({
  token: "",
  setToken: (e) => set(() => ({ token: e.target.value })),
}));
