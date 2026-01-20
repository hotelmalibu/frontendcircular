import api from "./index";

/**
 * Projects API Service
 * Handles all CRUD operations for projects management
 */

const PROJECTS_ENDPOINT = "/projects";

/**
 * Get all projects
 * @param {Object} params - Query parameters for filtering (title, author, category_id, etc.)
 * @returns {Promise} - List of all projects
 */
export const getAllProjects = async (params = {}) => {
  const defaultParams = {
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 15,
    ...params
  };

  const response = await api.get(PROJECTS_ENDPOINT, { params: defaultParams });
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
 * @param {FormData} projectData - FormData containing project fields and file
 * @returns {Promise} - Created project object
 */
export const createProject = async (projectData) => {
  if (!(projectData instanceof FormData)) {
    throw new Error("Project data must be FormData for file upload");
  }

  const response = await api.post(PROJECTS_ENDPOINT, projectData);
  return response.data;
};

/**
 * Update an existing project
 * @param {string} projectId - The project ID (ULID)
 * @param {FormData} projectData - FormData containing project fields and file
 * @returns {Promise} - Updated project object
 */
export const updateProject = async (projectId, projectData) => {
  if (!(projectData instanceof FormData)) {
    throw new Error("Project data must be FormData for file upload");
  }

  // Method spoofing for PUT requests with FormData
  if (!projectData.has('_method')) {
    projectData.append('_method', 'PUT');
  }

  // Using POST with _method=PUT because some PHP servers/Laravel versions 
  // struggle with true PUT/PATCH requests that contain files
  const response = await api.post(`${PROJECTS_ENDPOINT}/${projectId}`, projectData);
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

const projectsApi = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

export default projectsApi;