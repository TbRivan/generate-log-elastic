import { config } from "../config";
import { callAPI } from "../config/api";

let apiURL = `${config.host}:${config.port}`;
if (config.mode === "uat") {
  apiURL = `${config.host}`;
}

export const generateLogPrice = async (data, token) => {
  const request = {
    url: `${apiURL}/etrade/log-price/winquote`,
    method: "POST",
    data,
    token,
  };
  const response = await callAPI(request);
  return response;
};

export const generateLogChart = async (data, token) => {
  const request = {
    url: `${apiURL}/etrade/log-chart/price-history`,
    method: "POST",
    data,
    token,
  };
  const response = await callAPI(request);
  return response;
};
