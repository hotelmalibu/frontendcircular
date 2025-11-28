import api from "./index";

/**
 * Companies API Service
 * Handles all CRUD operations for companies management
 */

const COMPANIES_ENDPOINT = "/companies";

/**
 * Get all companies
 * @returns {Promise} - List of all companies
 */
export const getAllCompanies = async (page = 1, perPage = 15, sortBy = 'created_at', sortOrder = 'desc') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      sort_by: sortBy,
      sort_order: sortOrder
    });
    
    const response = await api.get(`${COMPANIES_ENDPOINT}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

/**
 * Get a single company by ID with full details including logo and products
 * @param {string} companyId - The company ID (ULID)
 * @returns {Promise} - Single company object with logo and products
 */
export const getCompanyById = async (companyId) => {
  try {
    const response = await api.get(`${COMPANIES_ENDPOINT}/${companyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching company ${companyId}:`, error);
    throw error;
  }
};

/**
 * Create a new company
 * @param {Object|FormData} companyData - Company data object or FormData with logo
 * @param {string} companyData.name - Company name
 * @param {string} companyData.description - Company description
 * @param {string} companyData.phone - Company phone
 * @param {string} companyData.address - Company address
 * @param {string} companyData.email - Company email
 * @param {string} companyData.website_url - Company website URL
 * @param {File} companyData.logo - Logo file (when using FormData)
 * @param {Array} companyData.products - Array of products (optional)
 * @returns {Promise} - Created company object
 */
export const createCompany = async (companyData) => {
  try {
    // If FormData, let axios set the content-type automatically (multipart/form-data)
    // If JSON data, explicitly set application/json
    const config = companyData instanceof FormData ? {} : {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    console.log("companiesApi.js - createCompany called with:", {
      isFormData: companyData instanceof FormData,
      config: config,
      endpoint: COMPANIES_ENDPOINT
    });
    
    // Log FormData contents if it's FormData
    if (companyData instanceof FormData) {
      console.log("FormData contents:");
      for (let [key, value] of companyData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
    }
    
    console.log("🚀 Sending request to:", COMPANIES_ENDPOINT);
    console.log("📤 Request config:", config);
    const response = await api.post(COMPANIES_ENDPOINT, companyData, config);
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

/**
 * Update an existing company
 * @param {string} companyId - The company ID (ULID)
 * @param {Object|FormData} companyData - Updated company data or FormData with logo
 * @returns {Promise} - Updated company object
 */
export const updateCompany = async (companyId, companyData) => {
  try {
    // If FormData, let axios set the content-type automatically (multipart/form-data)
    // If JSON data, explicitly set application/json
    const config = companyData instanceof FormData ? {} : {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const response = await api.put(`${COMPANIES_ENDPOINT}/${companyId}`, companyData, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating company ${companyId}:`, error);
    throw error;
  }
};

/**
 * Delete a company
 * @param {string} companyId - The company ID (ULID)
 * @returns {Promise} - Deletion confirmation
 */
export const deleteCompany = async (companyId) => {
  try {
    const response = await api.delete(`${COMPANIES_ENDPOINT}/${companyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting company ${companyId}:`, error);
    throw error;
  }
};

/**
 * Add a product to a company
 * @param {string} companyId - The company ID
 * @param {Object} productData - Product data
 * @returns {Promise} - Updated company with new product
 */
export const addProductToCompany = async (companyId, productData) => {
  try {
    const response = await api.post(`${COMPANIES_ENDPOINT}/${companyId}/products`, productData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding product to company ${companyId}:`, error);
    throw error;
  }
};

/**
 * Update a product in a company
 * @param {string} companyId - The company ID
 * @param {string} productId - The product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise} - Updated company with modified product
 */
export const updateCompanyProduct = async (companyId, productId, productData) => {
  try {
    const response = await api.put(`${COMPANIES_ENDPOINT}/${companyId}/products/${productId}`, productData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${productId} in company ${companyId}:`, error);
    throw error;
  }
};

/**
 * Delete a product from a company
 * @param {string} companyId - The company ID
 * @param {string} productId - The product ID
 * @returns {Promise} - Updated company without the deleted product
 */
export const deleteCompanyProduct = async (companyId, productId) => {
  try {
    const response = await api.delete(`${COMPANIES_ENDPOINT}/${companyId}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${productId} from company ${companyId}:`, error);
    throw error;
  }
};

export default {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  addProductToCompany,
  updateCompanyProduct,
  deleteCompanyProduct,
};