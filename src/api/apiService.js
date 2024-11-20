import { callAPI } from "../config/api";
import { useEnvironmentStore } from "../store/envStore";

export const generateLogPrice = async (data, token) => {
  const apiURL = useEnvironmentStore.getState().apiURL;

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
  const apiURL = useEnvironmentStore.getState().apiURL;

  const request = {
    url: `${apiURL}/etrade/log-chart/price-history`,
    method: "POST",
    data,
    token,
  };
  const response = await callAPI(request);
  return response;
};
