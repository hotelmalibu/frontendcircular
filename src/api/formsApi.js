import api from "./index";

const formsApi = {
    /**
     * Get all available field types for form building
     * @returns {Promise}
     */
    getFieldTypes: async () => {
        const response = await api.get("/forms/field-types");
        return response.data;
    },

    /**
     * List forms with optional filtering
     * @param {Object} params - Query parameters (status, search, sort_by, etc.)
     * @returns {Promise}
     */
    listForms: async (params = {}) => {
        const response = await api.get("/forms", { params });
        return response.data;
    },

    /**
     * Get a single form by ID
     * @param {string} id
     * @returns {Promise}
     */
    getForm: async (id) => {
        const response = await api.get(`/forms/${id}`);
        return response.data;
    },

    /**
     * Create a new form
     * @param {Object} formData
     * @returns {Promise}
     */
    createForm: async (formData) => {
        const response = await api.post("/forms", formData);
        return response.data;
    },

    /**
     * Update an existing form
     * @param {string} id
     * @param {Object|FormData} formData
     * @param {string} method - HTTP method to use (PUT or PATCH)
     * @returns {Promise}
     */
    updateForm: async (id, formData, method = 'PUT') => {
        // If it's FormData, use POST with _method spoofing
        if (formData instanceof FormData) {
            if (!formData.has('_method')) formData.append('_method', method);
            const response = await api.post(`/forms/${id}`, formData);
            return response.data;
        }

        // Standard JSON update
        if (method === 'PATCH') {
            const response = await api.patch(`/forms/${id}`, formData);
            return response.data;
        }
        
        const response = await api.put(`/forms/${id}`, formData);
        return response.data;
    },

    /**
     * Archive a form
     * @param {string} id
     * @returns {Promise}
     */
    archiveForm: async (id) => {
        return await formsApi.updateForm(id, { status: 'archived' });
    },

    /**
     * Publish a form
     * @param {string} id
     * @returns {Promise}
     */
    publishForm: async (id) => {
        const response = await api.post(`/forms/${id}/publish`);
        return response.data;
    },

    /**
     * Submit a response to a form
     * @param {string} id
     * @param {Object|FormData} submissionData
     * @returns {Promise}
     */
    submitForm: async (id, submissionData) => {
        // If it's FormData, axios handles headers
        const response = await api.post(`/forms/${id}/submit`, submissionData);
        return response.data;
    },

    /**
     * Delete a form
     * @param {string} id
     * @returns {Promise}
     */
    deleteForm: async (id) => {
        const response = await api.delete(`/forms/${id}`);
        return response.data;
    },

    /**
     * Get responses for a form
     * @param {string} id
     * @returns {Promise}
     */
    getFormResponses: async (id) => {
        // Try 'responses' as 'submissions' returned 404
        const response = await api.get(`/forms/${id}/responses`);
        return response.data;
    },

    /**
     * List public forms
     * @param {Object} params
     * @returns {Promise}
     */
    listPublicForms: async (params = {}) => {
        // Point to the dedicated public endpoint to avoid auth issues
        return await api.get("/forms/public", { params });
    },
    /**
     * Get statistics for the forms dashboard
     * @returns {Promise}
     */
    getStats: async () => {
        const response = await api.get("/forms/stats");
        return response.data;
    },
};

export default formsApi;
