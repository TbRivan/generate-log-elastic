import { create } from "zustand";
import { config } from "../config";

export const useEnvironmentStore = create((set) => ({
  environmentMode: "",
  mode: "",
  apiURL: "",
  doubleEnv: false,
  setEnvironmentMode: (val) => {
    let env = "";
    let mode = "";
    let doubleEnv = false;
    switch (val) {
      case "DEV":
        env = `Development`;
        mode = `${config.host_dev}:${config.port_dev}`;
        break;
      case "DEVDEV":
        env = `Development & Development`;
        mode = `${config.host_dev}:${config.port_dev}|${config.host_dev}:${config.port_dev}`;
        doubleEnv = true;
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
      case "LIVE":
        env = `LIVE`;
        mode = `${config.host_live}`;
        break;
      case "DEMOLIVE":
        env = `DEMO & LIVE`;
        mode = `${config.host_demo}|${config.host_live}`;
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
      doubleEnv,
    }));
  },
}));
