// src/api/auth.js
import api from "./index";

// auth endpoints are under /auth
export const login = (email, password) =>
  api.post(`/auth/login`, { email: email.trim(), password });

export const register = (data) => api.post(`/auth/register`, data);

export const getRoles = () => api.get(`/roles`);
