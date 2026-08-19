import axios from "axios";

/**
 * Integration Dashboard API Service
 * Endpoint: GET /integration/dashboard
 * Header: X-API-Key
 */
const INTEGRATION_API_URL = "https://api.andi.bocetos.co/integration/dashboard";
const DEFAULT_API_KEY = "sk_vision_2zgIH5vZtCTYQPZLYrSahGdw0LFPFvnT";

export const getIntegrationDashboard = async (year = 2024, apiKey = DEFAULT_API_KEY) => {
  const config = {
    headers: {
      "X-API-Key": apiKey,
      "Accept": "application/json",
    },
  };

  if (year) {
    config.params = { year };
  }

  const response = await axios.get(INTEGRATION_API_URL, config);
  return response.data;
};

const integrationApi = {
  getIntegrationDashboard,
};

export default integrationApi;
