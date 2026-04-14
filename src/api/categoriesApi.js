import api from "./index";

/**
 * Categories API Service
 * Handles all CRUD operations for categories management
 */

const CATEGORIES_ENDPOINT = "/categories";
const DEFAULT_PARAMS = "sort_by=created_at&sort_order=desc&per_page=1000"; // Traer todas las categorías; no limitar resultados

/**
 * Get all categories
 * @returns {Promise} - List of all categories
 */
export const getAllCategories = async () => {
  const response = await api.get(`${CATEGORIES_ENDPOINT}?${DEFAULT_PARAMS}`);
  return response.data;
};

/**
 * Get a single category by ID
 * @param {string} categoryId - The category ID
 * @returns {Promise} - Single category object
 */
export const getCategoryById = async (categoryId) => {
  const response = await api.get(`${CATEGORIES_ENDPOINT}/${categoryId}`);
  return response.data;
};

/**
 * Create a new category
 * @param {Object} categoryData - Category data object
 * @param {string} categoryData.name - Name of the category
 * @param {string} categoryData.description - Description of the category
 * @returns {Promise} - Created category object
 */
export const createCategory = async (categoryData) => {
  const response = await api.post(CATEGORIES_ENDPOINT, categoryData);
  return response.data;
};

/**
 * Update an existing category
 * @param {string} categoryId - The category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise} - Updated category object
 */
export const updateCategory = async (categoryId, categoryData) => {
  const response = await api.put(`${CATEGORIES_ENDPOINT}/${categoryId}`, categoryData);
  return response.data;
};

/**
 * Delete a category
 * @param {string} categoryId - The category ID
 * @returns {Promise} - Deletion confirmation
 */
export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`${CATEGORIES_ENDPOINT}/${categoryId}`);
  return response.data;
};

const categoriesApi = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoriesApi;