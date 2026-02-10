// src/api/auth.js
import api from "./index";

// auth endpoints are under /auth
export const login = (email, password) =>
  api.post(`/auth/login`, { email: email.trim(), password });

export const register = (data) => api.post(`/auth/register`, data);

// Roles CRUD
export const getRoles = () => api.get(`/auth/roles`);

export const getPublicRoles = () => api.get(`/auth/roles/public?sort_by=level&sort_order=desc&per_page=1000`);

export const createRole = (data) => api.post(`/auth/roles`, data);

export const updateRole = (id, data) => api.put(`/auth/roles/${id}`, data);

export const deleteRole = (id) => api.delete(`/auth/roles/${id}`);

export const getPermissions = () => api.get(`/auth/permissions`);

export const getUsers = () => api.get(`/auth/users`);

// Approval Workflow
export const getApprovals = () => api.get(`/auth/approvals`);
export const updateUserStatus = (userId, status) => api.post(`/auth/users/${userId}/status`, { status });
// Security Logs
export const getSecurityLogs = (params) => api.get(`/auth/security-logs`, { params });
export const markSecurityLogAsViewed = (id) => api.patch(`/auth/security-logs/${id}/viewed`);
export const deleteSecurityLog = (id) => api.delete(`/auth/security-logs/${id}`);
export const clearSecurityLogs = () => api.delete(`/auth/security-logs`);

export const getActiveSessions = () => api.get(`/auth/active-sessions`);
export const forgotPassword = (email) => api.post(`/auth/forgot-password`, { email });

export const resetPassword = (data) => api.post(`/auth/reset-password`, data);
