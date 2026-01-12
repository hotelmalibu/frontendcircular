import api from "./index";

const RESOURCE_URL = "/users";

// Based on existing api/auth.js and JSON request
export const getUsers = (params) => {
    // Legacy endpoint for listing users
    return api.get(`/auth/users`, { params });
};

export const getUser = (id) => {
    return api.get(`/users/${id}`);
};

export const createUser = (data) => {
    // Use the registration endpoint for creating users
    return api.post(`/auth/register`, data);
};

export const updateUser = (id, data) => {
    return api.put(`/users/${id}`, data);
};

export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};
