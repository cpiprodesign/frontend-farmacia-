import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import Categorias from "../views/Categorias.vue";
import Laboratorios from "../views/Laboratorios.vue";
import presentaciones from "../views/Presentaciones.vue";
import clientes from "../views/Clientes.vue";
import proveedores from "../views/Proveedores.vue";

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
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
