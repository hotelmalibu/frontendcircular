import axios from "axios";

// Base URL for API requests; adjust if backend runs elsewhere
// Use relative path in development to trigger the proxy in package.json
// Use absolute path in production
const API_BASE = process.env.NODE_ENV === 'development'
  ? "/api"
  : "https://api-ecocircular.creativostecnologicosit.com/api";


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
