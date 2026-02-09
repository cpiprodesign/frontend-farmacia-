import api from "./api";

export const getPresentaciones = () => api.get("/presentaciones");
export const createPresentacion = (data) => api.post("/presentaciones", data);
export const updatePresentacion = (id, data) =>
  api.put(`/presentaciones/${id}`, data);
export const deletePresentacion = (id) => api.delete(`/presentaciones/${id}`);
