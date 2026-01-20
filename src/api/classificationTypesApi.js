import api from "./index";

/**
 * Classification Types API Service
 * Handles fetching classification types for projects/documents
 */

const CLASSIFICATION_TYPES_ENDPOINT = "/classification-types";

/**
 * Get all classification types
 * @returns {Promise} - List of all classification types
 */
export const getClassificationTypes = async () => {
    const response = await api.get(CLASSIFICATION_TYPES_ENDPOINT);
    return response.data;
};

const classificationTypesApi = {
    getClassificationTypes,
};

export default classificationTypesApi;
