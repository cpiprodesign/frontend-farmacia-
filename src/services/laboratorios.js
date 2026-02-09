import api from "./api";

export const getLaboratorios = () => api.get("/laboratorios");
export const createLaboratorio = (data) => api.post("/laboratorios", data);
export const updateLaboratorio = (id, data) =>
  api.put(`/laboratorios/${id}`, data);
export const deleteLaboratorio = (id) => api.delete(`/laboratorios/${id}`);
