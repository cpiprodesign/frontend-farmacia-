import api from "./api";

export const getCompras = (params) => api.get("/compras", { params });

export const createCompra = (data) => api.post("/compras", data);
export const getCompra = (id) => api.get(`/compras/${id}`);
