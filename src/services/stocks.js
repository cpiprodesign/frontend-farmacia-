import api from "./api";

export const getStockProducto = (id) => api.get(`/productos/${id}/stock`);
