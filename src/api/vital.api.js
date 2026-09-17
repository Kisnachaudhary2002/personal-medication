import api from "./axios";

export const getVitals = (type) => api.get("/vitals", { params: type ? { type } : {} });
export const addVital = (data) => api.post("/vitals", data);
export const deleteVital = (id) => api.delete(`/vitals/${id}`);
