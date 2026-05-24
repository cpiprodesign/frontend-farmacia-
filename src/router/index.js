import { createRouter, createWebHistory } from "vue-router"
import axios from "axios"

import DashboardLayout from "../layouts/DashboardLayout.vue"
import Categorias from "../views/Categorias.vue"
import Laboratorios from "../views/Laboratorios.vue"
import Presentaciones from "../views/Presentaciones.vue"
import Clientes from "../views/Clientes.vue"
import Proveedores from "../views/Proveedores.vue"
import Productos from "../views/Productos.vue"
import Compras from "../views/Compras.vue"
import ComprasList from "../views/ComprasList.vue"
import VentasList from "../views/ventas/VentasList.vue"
import Ventaspos from "../views/ventas/Ventaspos.vue"
import LoginView from "../views/Login/LoginView.vue"
import SeleccionarSucursal from "../views/SeleccionarSucursalView.vue"
import SeleccionarCajaView from "../views/SeleccionarCajaView.vue"
import AperturaCajaView from "../views/AperturaCajaView.vue"
import listadocajas from "../views/CajaList.vue"
import dashboard from "../views/DashboardView.vue"

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },

  {
    path: "/seleccionar-sucursal",
    name: "seleccionar-sucursal",
    component: SeleccionarSucursal,
    meta: { requiresAuth: true },
  },

  {
    path: "/seleccionar-caja",
    name: "seleccionar-caja",
    component: SeleccionarCajaView,
    meta: { requiresAuth: true, requiresSucursal: true },
  },

  {
    path: "/apertura-caja",
    name: "apertura-caja",
    component: AperturaCajaView,
    meta: { requiresAuth: true, requiresSucursal: true, requiresCaja: true },
  },

  {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/ventas",
      },
      {
        path: "categorias",
        name: "categorias",
        component: Categorias,
        meta: { requiresAuth: true },
      },
      {
        path: "laboratorios",
        name: "laboratorios",
        component: Laboratorios,
        meta: { requiresAuth: true },
      },
      {
        path: "presentaciones",
        name: "presentaciones",
        component: Presentaciones,
        meta: { requiresAuth: true },
      },
      {
        path: "clientes",
        name: "clientes",
        component: Clientes,
        meta: { requiresAuth: true },
      },
      {
        path: "proveedores",
        name: "proveedores",
        component: Proveedores,
        meta: { requiresAuth: true },
      },
      {
        path: "productos",
        name: "productos",
        component: Productos,
        meta: { requiresAuth: true },
      },
      {
        path: "compras",
        name: "compras",
        component: Compras,
        meta: { requiresAuth: true, requiresCaja: true },
      },
      {
        path: "compraslist",
        name: "compraslist",
        component: ComprasList,
        meta: { requiresAuth: true },
      },
      {
        path: "ventas",
        name: "ventas",
        component: Ventaspos,
        meta: { requiresAuth: true, requiresCajaAbierta: true },
      },
      {
        path: "ventaslist",
        name: "ventaslist",
        component: VentasList,
        meta: { requiresAuth: true },
      },
      {
        path: "listado-cajas",
        name: "listado-cajas",
        component: listadocajas,
        meta: { requiresAuth: true },
      },
      {
        path: "Dashboard",
        name: "Dashboard",
        component: dashboard,
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")
  const sucursalId = localStorage.getItem("sucursal_id")
  const cajaId = localStorage.getItem("caja_id")
  const aperturaId = localStorage.getItem("apertura_id")

  // Si ya está logeado y quiere ir a login, redirigir
  if (to.path === "/login" && token) {
    return next("/seleccionar-sucursal")
  }

  // Proteger rutas con login
  if (to.meta.requiresAuth) {
    if (!token || !user) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("sucursal_id")
      localStorage.removeItem("caja_id")
      localStorage.removeItem("apertura_id")
      return next("/login")
    }
  }

  // Validar sucursal seleccionada
  if (to.meta.requiresSucursal) {
    if (!sucursalId) {
      return next("/seleccionar-sucursal")
    }
  }

  // Validar caja seleccionada
  if (to.meta.requiresCaja) {
    if (!cajaId) {
      return next("/seleccionar-caja")
    }
  }

  // Validar caja abierta solo para ventas
  if (to.meta.requiresCajaAbierta) {
    if (!cajaId) {
      return next("/seleccionar-caja")
    }

    if (aperturaId) {
      return next()
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/verificar-caja", {
        params: { caja_id: cajaId },
        headers: {
          Authorization: "Bearer " + token,
        },
      })

      if (res.data.abierta) {
        localStorage.setItem("apertura_id", res.data.apertura.id)
        return next()
      } else {
        return next("/apertura-caja")
      }
    } catch (error) {
      localStorage.removeItem("apertura_id")
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("sucursal_id")
      localStorage.removeItem("caja_id")
      return next("/login")
    }
  }

  next()
})

export default router