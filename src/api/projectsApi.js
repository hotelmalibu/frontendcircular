import api from "./index";

/**
 * Projects API Service
 * Handles all CRUD operations for projects management
 */

const PROJECTS_ENDPOINT = "/projects";

/**
 * Get all projects
 * @returns {Promise} - List of all projects
 */
export const getAllProjects = async () => {
  const response = await api.get(`${PROJECTS_ENDPOINT}?sort_by=created_at&sort_order=desc&per_page=15`);
  return response.data;
};

/**
 * Get a single project by ID
 * @param {string} projectId - The project ID (ULID)
 * @returns {Promise} - Single project object
 */
export const getProjectById = async (projectId) => {
  const response = await api.get(`${PROJECTS_ENDPOINT}/${projectId}`);
  return response.data;
};

/**
 * Create a new project
 * @param {Object} projectData - Project data object
 * @param {string} projectData.title - Title of the project
 * @param {string} projectData.description - Description or content
 * @param {string} projectData.category - Category of the project
 * @param {string} projectData.author - Author of the project
 * @returns {Promise} - Created project object
 */
export const createProject = async (projectData) => {
  const response = await api.post(PROJECTS_ENDPOINT, projectData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

/**
 * Update an existing project
 * @param {string} projectId - The project ID (ULID)
 * @param {Object} projectData - Updated project data
 * @returns {Promise} - Updated project object
 */
export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`${PROJECTS_ENDPOINT}/${projectId}`, projectData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

/**
 * Delete a project
 * @param {string} projectId - The project ID (ULID)
 * @returns {Promise} - Deletion confirmation
 */
export const deleteProject = async (projectId) => {
  const response = await api.delete(`${PROJECTS_ENDPOINT}/${projectId}`);
  return response.data;
};

export default {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};