// src/api/auth.js
import api from "./index";

// auth endpoints are under /auth
export const login = (email, password) =>
  api.post(`/auth/login`, { email: email.trim(), password });

export const register = (data) => api.post(`/auth/register`, data);

// Roles CRUD
export const getRoles = () => api.get(`/auth/roles`);

export const createRole = (data) => api.post(`/auth/roles`, data);

export const updateRole = (id, data) => api.put(`/auth/roles/${id}`, data);

export const deleteRole = (id) => api.delete(`/auth/roles/${id}`);
