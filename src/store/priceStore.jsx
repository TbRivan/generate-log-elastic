import { create } from "zustand";

export const usePriceStore = create((set) => ({
  price: [],
  setPrice: (price) => set(() => ({ price: price })),
}));
