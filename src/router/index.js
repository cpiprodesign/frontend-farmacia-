import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import Categorias from "../views/Categorias.vue";
import Laboratorios from "../views/Laboratorios.vue";
import presentaciones from "../views/Presentaciones.vue";
import clientes from "../views/Clientes.vue";
import proveedores from "../views/Proveedores.vue";
import productos from "../views/Productos.vue";
import compras from "../views/Compras.vue";
import ventas from "../views/Ventas.vue";
import comprasList from "../views/ComprasList.vue";
import ComprasList from "../views/ComprasList.vue";
//import posventa from "../views/ventas/Ventaspos.vue";
import ventaspos from "../views/ventas/Ventaspos.vue";
import Ventaspos from "../views/ventas/Ventaspos.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "categorias",
        component: Categorias,
      },
      {
        path: "laboratorios",
        component: Laboratorios,
      },
      {
        path: "presentaciones",
        component: presentaciones,
      },
      {
        path: "clientes",
        component: clientes,
      },
      {
        path: "proveedores",
        component: proveedores,
      },
      {
        path: "productos",
        component: productos,
      },
      {
        path: "compras",
        component: compras,
      },
      {
        path: "compraslist",
        component: ComprasList,
      },
      {
        path: "ventas",
        component: Ventaspos,
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
