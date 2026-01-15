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
     * @param {Object} formData
     * @returns {Promise}
     */
    updateForm: async (id, formData) => {
        const response = await api.put(`/forms/${id}`, formData);
        return response.data;
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
};

export default formsApi;
