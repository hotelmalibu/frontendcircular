import api from "./index";

const TEAM_ENDPOINT = "/v1/team-members";

export const getAllMembers = async () => {
    const response = await api.get(TEAM_ENDPOINT);
    return response.data;
};

export const createMember = async (formData) => {
    // using formData to support file upload
    const response = await api.post(TEAM_ENDPOINT, formData);
    return response.data;
};

export const updateMember = async (id, formData) => {
    const response = await api.post(`${TEAM_ENDPOINT}/${id}`, formData);
    return response.data;
};

export const deleteMember = async (id) => {
    const response = await api.delete(`${TEAM_ENDPOINT}/${id}`);
    return response.data;
};

export const updateMembersOrder = async (orderedIds) => {
    const response = await api.post(`${TEAM_ENDPOINT}/reorder`, { orderedIds });
    return response.data;
};

const teamApi = {
    getAllMembers,
    createMember,
    updateMember,
    deleteMember,
    updateMembersOrder,
};

export default teamApi;
