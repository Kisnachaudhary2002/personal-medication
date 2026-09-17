import api from "./axios";

export const getVaccinations = () => api.get("/vaccinations");
export const addVaccination = (data) => api.post("/vaccinations", data);
export const deleteVaccination = (id) => api.delete(`/vaccinations/${id}`);
