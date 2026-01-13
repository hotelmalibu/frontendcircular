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
 * Get a single news by ID with full details including upload_file
 * @param {string} newsId - The news ID (ULID)
 * @returns {Promise} - Single news object with upload_file
 */
export const getNewsById = async (newsId) => {
  const response = await api.get(`${NEWS_ENDPOINT}/${newsId}`);
  return response.data;
};

/**
 * Get published news with images (combines list and individual calls)
 * This function gets the list and then fetches detailed data for items with images
 * @returns {Promise} - Array of news with upload_file information
 */
export const getPublishedNewsWithImages = async () => {
  try {
    // First, get the list of all news
    const listResponse = await getAllNews();

    let newsArray = [];
    if (Array.isArray(listResponse)) {
      newsArray = listResponse;
    } else if (listResponse?.data?.news && Array.isArray(listResponse.data.news)) {
      newsArray = listResponse.data.news;
    } else if (listResponse?.data && Array.isArray(listResponse.data)) {
      newsArray = listResponse.data;
    } else if (listResponse?.news && Array.isArray(listResponse.news)) {
      newsArray = listResponse.news;
    } else if (typeof listResponse === 'object' && listResponse !== null) {
      const possibleArrays = Object.values(listResponse).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0) {
        newsArray = possibleArrays[0];
      }
    }

    // Filter only published news
    const publishedNews = newsArray.filter(n => n.status === 'published');

    // For each published news, try to get detailed info with image
    // We'll do this sequentially to avoid overwhelming the API
    const detailedNews = await Promise.all(
      publishedNews.map(async (newsItem) => {
        try {
          const detailedResponse = await getNewsById(newsItem.id);
          const detailedNews = detailedResponse.data?.news || detailedResponse.news || detailedResponse;



          return detailedNews;
        } catch (error) {

          // Return the basic news item if detailed fetch fails
          return newsItem;
        }
      })
    );

    return detailedNews;
  } catch (error) {
    console.error("Error getting published news with images:", error);
    throw error;
  }
};

/**
 * Create a new news
 * @param {Object|FormData} newsData - News data object or FormData with file
 * @param {string} newsData.type - Type of content (news, event)
 * @param {string} newsData.title - Title of the news
 * @param {string} newsData.description - Description or content
 * @param {string} newsData.category - Category of the news
 * @param {string} newsData.author - Author of the news
 * @param {string} newsData.start_date - Start date (ISO 8601)
 * @param {string} newsData.end_date - End date (ISO 8601)
 * @param {string} newsData.published_at - Publication date (ISO 8601)
 * @param {string} newsData.status - Status (draft, published)
 * @param {File} newsData.upload_file - Image file (when using FormData)
 * @returns {Promise} - Created news object
 */
export const createNews = async (newsData) => {
  // If FormData, let axios set the content-type automatically (multipart/form-data)
  // If JSON data, explicitly set application/json
  const config = newsData instanceof FormData ? {} : {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await api.post(NEWS_ENDPOINT, newsData, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing news
 * @param {string} newsId - The news ID (ULID)
 * @param {Object|FormData} newsData - Updated news data or FormData with file
 * @returns {Promise} - Updated news object
 */
export const updateNews = async (newsId, newsData) => {
  // If FormData, use POST with _method spoofing for better backend compatibility
  if (newsData instanceof FormData) {
    // Only append if it doesn't already exist
    if (!newsData.has('_method')) {
      newsData.append('_method', 'PUT');
    }
    const response = await api.post(`${NEWS_ENDPOINT}/${newsId}`, newsData);
    return response.data;
  }

  // If JSON data
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await api.put(`${NEWS_ENDPOINT}/${newsId}`, newsData, config);
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

const newsApi = {
  getAllNews,
  getNewsById,
  getPublishedNewsWithImages,
  createNews,
  updateNews,
  deleteNews,
};

export default newsApi;
