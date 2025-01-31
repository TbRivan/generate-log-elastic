import { create } from "zustand";

export const usePriceStore = create((set) => ({
  data: [],
  year: "",
  setData: (data) => set(() => ({ data: data })),
  setYear: (value) => set(() => ({ year: value })),
}));
