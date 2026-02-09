import api from "./index";

/**
 * Helpdesk API service
 * Referencing endpoints from Postman collection provided.
 */

// POST /helpdesk - Create a new ticket
export const createTicket = (formData) => {
    return api.post("/helpdesk", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// GET /helpdesk - List tickets with optional query params
export const getTickets = (params = {}) => {
    return api.get("/helpdesk", { params });
};

// GET /helpdesk/{id} - Get a single ticket
export const getTicket = (id) => {
    return api.get(`/helpdesk/${id}`);
};

// POST /helpdesk/{id} (with _method=PUT) - Update a ticket
export const updateTicket = (id, formData) => {
    // Add _method: PUT for Laravel/API handling if not already in formData
    if (!(formData instanceof FormData)) {
        formData = { ...formData, _method: "PUT" };
        return api.post(`/helpdesk/${id}`, formData);
    }

    if (!formData.has("_method")) {
        formData.append("_method", "PUT");
    }

    return api.post(`/helpdesk/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// DELETE /helpdesk/{id} - Delete a ticket
export const deleteTicket = (id) => {
    return api.delete(`/helpdesk/${id}`);
};

const helpdeskApi = {
    createTicket,
    getTickets,
    getTicket,
    updateTicket,
    deleteTicket,
};

export default helpdeskApi;
