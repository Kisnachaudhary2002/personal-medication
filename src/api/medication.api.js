import api from "./axios";

export const getMedications = () => api.get("/medications");
export const addMedication = (data) => api.post("/medications", data);
export const updateMedication = (id, data) => api.put(`/medications/${id}`, data);
export const deleteMedication = (id) => api.delete(`/medications/${id}`);
export const logDose = (id, data) => api.post(`/medications/${id}/log-dose`, data);
