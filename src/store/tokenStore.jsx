import { create } from "zustand";
import Cookies from "js-cookie";
import { useEnvironmentStore } from "./envStore";

export const useTokenStore = create((set) => ({
  token: "",
  setToken: (val) => set(() => ({ token: val })),
  checkTokenFromCookie: () => {
    const setEnvironmentMode =
      useEnvironmentStore.getState().setEnvironmentMode;

    const token = Cookies.get("token");
    const environment = Cookies.get("environment");

    let cookiesToken, cookiesEnvironment;

    if (token && environment) {
      cookiesToken = token;
      cookiesEnvironment = environment;
    } else {
      cookiesToken = "";
      cookiesEnvironment = "";
    }

    setEnvironmentMode(cookiesEnvironment);
    set(() => ({ token: cookiesToken }));
  },
}));
