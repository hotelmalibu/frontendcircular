import api from "./index";

/**
 * About Us API Service
 */

const ABOUT_US_ENDPOINT = "/v1/about-us";
const LEADER_QUOTES_ENDPOINT = "/v1/leader-quotes";

/**
 * Get About Us content
 */
export const getAboutUs = async () => {
    const response = await api.get(ABOUT_US_ENDPOINT);
    return response.data;
};

/**
 * Update About Us content
 */
export const updateAboutUs = async (data) => {
    const response = await api.put(ABOUT_US_ENDPOINT, data);
    return response.data;
};

/**
 * Get all leader quotes
 */
export const getAllLeaderQuotes = async () => {
    const response = await api.get(LEADER_QUOTES_ENDPOINT);
    return response.data;
};

/**
 * Create a new leader quote
 */
export const createLeaderQuote = async (data) => {
    const response = await api.post(LEADER_QUOTES_ENDPOINT, data);
    return response.data;
};

/**
 * Update a leader quote
 */
export const updateLeaderQuote = async (id, data) => {
    const response = await api.put(`${LEADER_QUOTES_ENDPOINT}/${id}`, data);
    return response.data;
};

/**
 * Delete a leader quote
 */
export const deleteLeaderQuote = async (id) => {
    const response = await api.delete(`${LEADER_QUOTES_ENDPOINT}/${id}`);
    return response.data;
};

const aboutUsApi = {
    getAboutUs,
    updateAboutUs,
    getAllLeaderQuotes,
    createLeaderQuote,
    updateLeaderQuote,
    deleteLeaderQuote,
};

export default aboutUsApi;
