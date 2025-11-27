import api from './index';

// Base URL for schedule endpoints
const SCHEDULE_BASE_URL = '/schedule';

// Get all schedules/events
export const getAllSchedules = async (page = 1, perPage = 15) => {
  try {
    const response = await api.get(`${SCHEDULE_BASE_URL}?page=${page}&per_page=${perPage}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

// Get schedule by ID
export const getScheduleById = async (id) => {
  try {
    const response = await api.get(`${SCHEDULE_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching schedule ${id}:`, error);
    throw error;
  }
};

// Create new schedule/event
export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post(SCHEDULE_BASE_URL, scheduleData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

// Update schedule/event
export const updateSchedule = async (id, scheduleData) => {
  try {
    const response = await api.put(`${SCHEDULE_BASE_URL}/${id}`, scheduleData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating schedule ${id}:`, error);
    throw error;
  }
};

// Delete schedule/event
export const deleteSchedule = async (id) => {
  try {
    const response = await api.delete(`${SCHEDULE_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting schedule ${id}:`, error);
    throw error;
  }
};

// Publish schedule/event
export const publishSchedule = async (id) => {
  try {
    const response = await api.patch(`${SCHEDULE_BASE_URL}/${id}/publish`);
    return response.data;
  } catch (error) {
    console.error(`Error publishing schedule ${id}:`, error);
    throw error;
  }
};

// Unpublish schedule/event
export const unpublishSchedule = async (id) => {
  try {
    const response = await api.patch(`${SCHEDULE_BASE_URL}/${id}/unpublish`);
    return response.data;
  } catch (error) {
    console.error(`Error unpublishing schedule ${id}:`, error);
    throw error;
  }
};