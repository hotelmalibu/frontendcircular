import axios from "axios";

// ==============================================================================
// CONFIGURACIÓN DE CONEXIÓN CON EL BACKEND (API)
// ==============================================================================
// Cambia a 'true' para usar tu Laravel local (cuando tengas 'php artisan serve' con MySQL listo),
// o 'false' (por defecto) para usar el servidor oficial en producción/remoto
const USE_LOCAL = false;

// URLs configurables
const LOCAL_API_URL = "http://127.0.0.1:8000/api"; // Tu servidor local con 'php artisan serve'
// const LOCAL_API_URL = "http://plataformaeconomiacircular.test/api"; // Alternativa con Laragon VirtualHost
const REMOTE_API_URL = "https://api-ecocircular.creativostecnologicosit.com/api";

const API_BASE = process.env.REACT_APP_API_URL || (
  USE_LOCAL
    ? LOCAL_API_URL
    : (process.env.NODE_ENV === 'development' ? "/api" : REMOTE_API_URL)
);
// ==============================================================================

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
