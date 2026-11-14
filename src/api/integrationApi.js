import api from './index';

// Provider credentials remain on the backend. Only public aggregates reach the browser.
export const getIntegrationDashboard = async (year = new Date().getFullYear()) => {
  const response = await api.get('/integration/dashboard', { params: { year } });
  return response.data;
};

const integrationApi = { getIntegrationDashboard };
export default integrationApi;
