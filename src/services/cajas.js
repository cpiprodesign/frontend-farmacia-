import api from "./api"

export const getAperturasCaja = (params) =>
  api.get("/aperturas-caja", { params })

export const getResumenCaja = (id) =>
  api.get(`/aperturas-caja/${id}/resumen`)

export const cerrarCaja = (data) =>
  api.post("/aperturas-caja/cerrar", data)