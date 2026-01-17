import api from "./index";

/**
 * Project Types API Service
 * Handles fetching project types from /project-types
 */

const PROJECT_TYPES_ENDPOINT = "/project-types";

/**
 * Get all project types
 * @returns {Promise} - List of all project types
 */
export const getProjectTypes = async () => {
    try {
        const response = await api.get(PROJECT_TYPES_ENDPOINT);
        // API returns { data: { items: [...], pagination: {...} } }
        return response.data;
    } catch (error) {
        console.warn("Project types endpoint not found or error, using fallback", error);
        // Hardcoded fallback matching user provided structure
        return {
            data: {
                items: [
                    { id: "01kf4t4c93698d14kad9032qt7", label: "Sectorial" },
                    { id: "01kf4t4c9kdsh8qpt9jj62h7b7", label: "Territorial" }
                ]
            }
        };
    }
};

const projectTypesApi = {
    getProjectTypes,
};

export default projectTypesApi;
