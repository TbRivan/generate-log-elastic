import { create } from "zustand";

export const usePriceStore = create((set) => ({
  data: [],
  setData: (data) => set(() => ({ data: data })),
}));
