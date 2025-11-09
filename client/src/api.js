import axios from "axios";

const baseURL =
  (import.meta?.env?.VITE_API_URL?.replace(/\/+$/, "")) || "http://localhost:4000";

const instance = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true, // allow cookies/session auth
});

function setToken(token) {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
}

export const api = {
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  delete: (url, config) => instance.delete(url, config),
  setToken,
};
