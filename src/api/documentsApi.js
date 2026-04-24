import api from "./index";

/**
 * Documents API Service
 * Handles document upload operations
 */

const DOCUMENTS_ENDPOINT = "/document";

/**
 * Get all documents
 * @param {Object} params - Query parameters for pagination/filtering
 * @returns {Promise} - List of documents with pagination
 */
export const getDocuments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${DOCUMENTS_ENDPOINT}?${queryString}` : DOCUMENTS_ENDPOINT;

  const response = await api.get(url);
  return response.data;
};
/**
 * Get a single document by ID
 * @returns {Promise} - Document object
 */
export const getDocumentTypes = async () => {
  const response = await api.get(`${DOCUMENTS_ENDPOINT}/types`);
  return response.data;
};

/**
 * Get a single document by ID
 * @param {string} id - Document ID
 * @returns {Promise} - Document object
 */
export const getDocument = async (id) => {
  const response = await api.get(`${DOCUMENTS_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Create a new document
 * @param {FormData} documentData - FormData containing document fields and file
 * @returns {Promise} - Created document object
 */
export const createDocument = async (documentData) => {
  if (!(documentData instanceof FormData)) {
    throw new Error("Document data must be FormData for file upload");
  }

  try {
    const response = await api.post(DOCUMENTS_ENDPOINT, documentData);
    return response.data;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

/**
 * Update an existing document
 * @param {string} id - Document ID
 * @param {FormData} documentData - FormData containing document fields and file
 * @returns {Promise} - Updated document object
 */
export const updateDocument = async (id, documentData) => {
  if (!(documentData instanceof FormData)) {
    throw new Error("Document data must be FormData for file upload");
  }

  // Ensure _method is set to PUT for FormData handling in backend
  if (!documentData.has('_method')) {
    documentData.append('_method', 'PUT');
  }

  try {
    // We utilize POST with _method called "method spoofing" because
    // PHP/Laravel sometimes has issues with PUT requests containing files/FormData
    const response = await api.post(`${DOCUMENTS_ENDPOINT}/${id}`, documentData);
    return response.data;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} id - Document ID
 * @returns {Promise} - Response data
 */
export const deleteDocument = async (id) => {
  try {
    const response = await api.delete(`${DOCUMENTS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

const documentsApi = {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument
};

export default documentsApi;