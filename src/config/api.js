import axios from "axios";

export const callAPI = async ({ url, method, data, token }) => {
  let headers = {};

  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await axios({
    url,
    method,
    data,
    headers,
  }).catch((err) => err.response);

  if (response.data.headers.statusCode !== 200) {
    const res = {
      error: true,
      message: response.data.headers.message,
      data: null,
    };
    return res;
  }

  const res = {
    error: false,
    message: response.data.headers.message,
    data: response.data.data,
  };

  return res;
};
