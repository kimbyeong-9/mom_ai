import axios from "axios";

import { useAuthStore } from "@/store/auth.store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // A plain assignment (not the router's SPA navigate) on purpose — this
      // runs from an axios interceptor, which importing the router singleton
      // into would pull `createBrowserRouter()` (needs a real `document`)
      // into every module that imports this file, including non-DOM test
      // environments. A full reload is also the safer choice for "session
      // just expired" anyway: it guarantees no stale in-memory query cache.
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
