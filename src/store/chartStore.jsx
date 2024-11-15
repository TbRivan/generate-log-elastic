import { create } from "zustand";

export const useChartStore = create((set) => ({
  dateFrom: new Date(),
  dateTo: new Date(),
  timeFrom: "00:00:00",
  timeTo: "23:59:59",
  symbol: "",
  setDateFrom: (value) => set(() => ({ dateFrom: value })),
  setDateTo: (value) => set(() => ({ dateTo: value })),
  setTimeFrom: (e) => set(() => ({ timeFrom: e.target.value })),
  setTimeTo: (e) => set(() => ({ timeTo: e.target.value })),
  setSymbol: (e) => set(() => ({ symbol: e.target.value })),
}));
