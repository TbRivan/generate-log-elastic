import { create } from "zustand";
import { config } from "../config";

export const useEnvironmentStore = create((set) => ({
  environmentMode: "",
  mode: "",
  apiURL: "",
  setEnvironmentMode: (val) => {
    let env = "";
    let mode = "";
    switch (val) {
      case "DEV":
        env = `Development`;
        mode = `${config.host_dev}:${config.port_dev}`;
        break;
      case "LAB":
        env = `LAB`;
        mode = `${config.host_lab}:${config.port_lab}`;
        break;
      case "UAT":
        env = `UAT`;
        mode = `${config.host_uat}`;
        break;
      case "DEMO":
        env = `DEMO`;
        mode = `${config.host_demo}`;
        break;
      default:
        env = "";
        mode = "";
        break;
    }
    set(() => ({
      mode: env,
      environmentMode: val,
      apiURL: mode,
    }));
  },
}));
