import { TASK } from "./apiRoutes";
import { apiService2 } from "./apiBaseUrl";

export const addTask = async (data) => {
  const response = await apiService2.post(`${TASK}`, data);
  return response;
};

export const editTask = async (id, data) => {
  const response = await apiService2.put(`${TASK}/${id}`, data);
  return response;
};

export const deleteTask = async (id) => {
  const response = await apiService2.delete(`${TASK}/${id}`);
  return response;
};

export const listOfTask = async (data) => {
  const response = await apiService2.post(`${TASK}/list`, data);
  return response.data;
};

export const detailsOfTask = async (id) => {
  const response = await apiService2.post(`${TASK}/${id}`);
  return response.data;
};
