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
 * Create a new document
 * @param {FormData} documentData - FormData containing document fields and file
 * @param {string} documentData.document_type_id - Document type ID (1-5)
 * @param {string} documentData.name - Document name
 * @param {string} documentData.description - Document description
 * @param {string} documentData.version - Document version
 * @param {string} documentData.expires_at - Expiration date
 * @param {string} documentData.status - Document status
 * @param {File} documentData.file - Document file
 * @returns {Promise} - Created document object
 */
export const createDocument = async (documentData) => {
  // Ensure it's FormData for file upload
  if (!(documentData instanceof FormData)) {
    throw new Error("Document data must be FormData for file upload");
  }

  console.log("documentsApi.js - createDocument called with FormData");

  // Log FormData contents
  console.log("FormData contents:");
  for (let [key, value] of documentData.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  }

  try {
    console.log("🚀 Sending request to:", DOCUMENTS_ENDPOINT);
    const response = await api.post(DOCUMENTS_ENDPOINT, documentData);
    console.log("✅ API Response:", response);
    return response.data;
  } catch (error) {
    console.error("❌ API Error Details:");
    console.error("  Error object:", error);
    console.error("  Response:", error.response);
    console.error("  Response data:", error.response?.data);
    console.error("  Status:", error.response?.status);
    console.error("  Status text:", error.response?.statusText);
    throw error;
  }
};

const documentsApi = {
  getDocuments,
  createDocument,
};

export default documentsApi;