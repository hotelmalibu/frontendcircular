import api from "./index";

const ENDPOINT = "/v1/vision-circular-forms";

export const createVisionCircularForm = async (formData) => {
  const response = await api.post(ENDPOINT, formData);
  return response.data;
};

export const getVisionCircularForms = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

export const deleteVisionCircularForm = async (id) => {
  const response = await api.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
