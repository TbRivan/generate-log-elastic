import { callAPI } from "../config/api";

export const generateLogPrice = async (data, url, token) => {
  const request = {
    url: `${url}/etrade/log-price/winquote`,
    method: "POST",
    data,
    token,
  };
  const response = await callAPI(request);
  return response;
};

export const generateLogChart = async (data, url, token) => {
  const request = {
    url: `${url}/etrade/log-chart/price-history`,
    method: "POST",
    data,
    token,
  };
  const response = await callAPI(request);
  return response;
};
