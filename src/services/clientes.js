import api from "./api";

// LISTAR PAGINADO
export const getClientes = (params) => api.get("/clientes", { params });

// CREAR
export const createCliente = (data) => api.post("/clientes", data);

// ACTUALIZAR
export const updateCliente = (id, data) => api.put(`/clientes/${id}`, data);

// ELIMINAR
export const deleteCliente = (id) => api.delete(`/clientes/${id}`);
