import { create } from "zustand";
import Cookies from "js-cookie";

export const useTokenStore = create((set) => ({
  token: "",
  setToken: (e) => set(() => ({ token: e.target.value })),
  checkTokenFromCookie: () => {
    const token = Cookies.get("token");
    let cookiesToken;
    if (token) {
      cookiesToken = token;
    } else {
      cookiesToken = "";
    }

    set(() => ({ token: cookiesToken }));
  },
}));
