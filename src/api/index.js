import axios from "axios";

// Base URL for API requests; adjust if backend runs elsewhere
const API_BASE = "https://api-ecocircular.creativostecnologicosit.com/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // withCredentials: true, // enable if you use cookie-based auth
});

// Attach Authorization header automatically from localStorage token if present
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        // If token already prefixed with Bearer, avoid double prefix
        config.headers.Authorization = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
      }
    } catch (e) {
      // ignore localStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
