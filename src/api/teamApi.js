import api from "./index";

const TEAM_ENDPOINT = "/v1/team-members";

export const getAllMembers = async () => {
    const response = await api.get(TEAM_ENDPOINT);
    return response.data;
};

export const createMember = async (formData) => {
    // using formData to support file upload
    const response = await api.post(TEAM_ENDPOINT, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateMember = async (id, formData) => {
    // Laravel usually accepts POST with _method=PUT or PUT if not multipart.
    // For FormData, often we post to /endpoint/{id} with _method=PUT
    formData.append("_method", "PUT");
    const response = await api.post(`${TEAM_ENDPOINT}/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
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
