import api from "./index";

/**
 * News API Service
 * Handles all CRUD operations for news management
 */

const NEWS_ENDPOINT = "/news";

/**
 * Get all news
 * @returns {Promise} - List of all news
 */
export const getAllNews = async () => {
  const response = await api.get(NEWS_ENDPOINT);
  return response.data;
};

/**
 * Get a single news by ID
 * @param {string} newsId - The news ID (ULID)
 * @returns {Promise} - Single news object
 */
export const getNewsById = async (newsId) => {
  const response = await api.get(`${NEWS_ENDPOINT}/${newsId}`);
  return response.data;
};

/**
 * Create a new news
 * @param {Object} newsData - News data object
 * @param {string} newsData.type - Type of content (news, event)
 * @param {string} newsData.title - Title of the news
 * @param {string} newsData.description - Description or content
 * @param {string} newsData.category - Category of the news
 * @param {string} newsData.author - Author of the news
 * @param {string} newsData.start_date - Start date (ISO 8601)
 * @param {string} newsData.end_date - End date (ISO 8601)
 * @param {string} newsData.published_at - Publication date (ISO 8601)
 * @param {string} newsData.status - Status (draft, published)
 * @returns {Promise} - Created news object
 */
export const createNews = async (newsData) => {
  const response = await api.post(NEWS_ENDPOINT, newsData);
  return response.data;
};

/**
 * Update an existing news
 * @param {string} newsId - The news ID (ULID)
 * @param {Object} newsData - Updated news data
 * @returns {Promise} - Updated news object
 */
export const updateNews = async (newsId, newsData) => {
  const response = await api.put(`${NEWS_ENDPOINT}/${newsId}`, newsData);
  return response.data;
};

/**
 * Delete a news
 * @param {string} newsId - The news ID (ULID)
 * @returns {Promise} - Deletion confirmation
 */
export const deleteNews = async (newsId) => {
  const response = await api.delete(`${NEWS_ENDPOINT}/${newsId}`);
  return response.data;
};

export default {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
