import api from "./api";

export const getProductos = (params) => api.get("/productos", { params });

export const createProducto = (data) => api.post("/productos", data);

export const updateProducto = (id, data) => api.put(`/productos/${id}`, data);

export const deleteProducto = (id) => api.delete(`/productos/${id}`);
export const getCategorias = () => api.get("/categorias");
export const getLaboratorios = () => api.get("/laboratorios");
export const getProveedores = () => api.get("/proveedores");
export const getPresentaciones = () => api.get("/presentaciones");
export const searchProductos = (params) =>
  api.get("/productos/listar", { params });
