import api from "./index";

/**
 * Banners API Service
 * Handles fetching and persisting banner configurations to the backend when available.
 */
const BANNERS_ENDPOINT = "/v1/banners";

export const getBannersApi = async () => {
  try {
    const response = await api.get(BANNERS_ENDPOINT);
    return response.data;
  } catch (error) {
    // Graceful fallback when endpoint is not yet present on remote backend
    return null;
  }
};

export const updateBannerApi = async (pageKey, data) => {
  try {
    const response = await api.post(`${BANNERS_ENDPOINT}/${pageKey}`, data);
    return response.data;
  } catch (error) {
    // Graceful fallback to client persistence
    return null;
  }
};

const bannersApi = {
  getBannersApi,
  updateBannerApi,
};

export default bannersApi;
