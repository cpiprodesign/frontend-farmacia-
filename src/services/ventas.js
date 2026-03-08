import api from "./api";

/* 🔹 LISTAR */
export const getVentas = (params) => api.get("/ventas", { params });

/* 🔹 VER */
export const getVenta = (id) => api.get(`/ventas/${id}`);

/* 🔹 CREAR */
export const createVenta = (data) => api.post("/ventas", data);

/* 🔹 ELIMINAR */
export const deleteVenta = (id) => api.delete(`/ventas/${id}`);
