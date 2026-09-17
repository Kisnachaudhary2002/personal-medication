import api from "./axios";

export const getPatients = (search) => api.get("/admin/patients", { params: { search } });
export const getPatientDetail = (id) => api.get(`/admin/patients/${id}`);
