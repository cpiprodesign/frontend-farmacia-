import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "./assets/main.css";
import '@fortawesome/fontawesome-free/css/all.min.css'
import { faPlus } from "@fortawesome/free-solid-svg-icons";

library.add(faPlus);
// 👉 FONT AWESOME
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChartLine,
  faCartShopping,
  faCashRegister,
  faWallet,
  faBox,
  faLayerGroup,
  faBoxOpen,
  faFlask,
  faCapsules,
  faUsers,
  faTruck,
  faWarehouse,
  faClipboardList,
  faBoxesStacked,
  faFileLines,
  faChartPie,
  faChartColumn,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// 👉 Registrar iconos que usa tu navbar
library.add(
  faChartLine,
  faCartShopping,
  faCashRegister,
  faWallet,
  faBox,
  faLayerGroup,
  faBoxOpen,
  faFlask,
  faCapsules,
  faUsers,
  faTruck,
  faWarehouse,
  faClipboardList,
  faBoxesStacked,
  faFileLines,
  faChartPie,
  faChartColumn,
);

const app = createApp(App);

app.use(router);
app.use(ElementPlus);

// 👉 Componente global
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
