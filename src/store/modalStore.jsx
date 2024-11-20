import { create } from "zustand";

export const useModalStore = create((set) => ({
  isModalOpen: false,
  setModalOpen: () => set(() => ({ isModalOpen: true })),
  setModalClose: () => set(() => ({ isModalOpen: false })),
}));
