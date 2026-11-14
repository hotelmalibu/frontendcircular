import axios from "axios";

// Only the public API address belongs in frontend configuration. Never include secrets.
// Development preserves the local Laravel server; production uses an explicit URL or proxy.
const API_BASE = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'development' ? "http://127.0.0.1:8000/api" : "/api"
);
export const API_ORIGIN = new URL(API_BASE, window.location.origin).origin;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    // Don't set default Content-Type - let axios handle it automatically for FormData
  },
  // withCredentials: true, // enable if you use cookie-based auth
});

// Attach Authorization header automatically from localStorage token if present
api.interceptors.request.use(
  (config) => {
    const destination = new URL(api.getUri(config), window.location.origin);
    // Redact existing headers case-insensitively before reading browser storage.
    if (destination.origin !== API_ORIGIN) {
      if (typeof config.headers?.delete === 'function') config.headers.delete('Authorization');
      else Object.keys(config.headers || {}).forEach((key) => {
        if (key.toLowerCase() === 'authorization') delete config.headers[key];
      });
      return config;
    }
    try {
      // Intentar obtener del persistente o del temporal
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        // If token already prefixed with Bearer, avoid double prefix
        config.headers.Authorization = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
      }
    } catch (e) {
      // ignore localStorage/sessionStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
