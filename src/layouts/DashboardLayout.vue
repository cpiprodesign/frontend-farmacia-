<template>
  <div class="layout">
    <!-- TOPBAR -->
    <header class="topbar">
      <!-- LEFT -->
      <div class="left">
        <div class="logo">
          <span>Systfarma</span>
        </div>

        <!-- DESKTOP MENU -->
        <nav class="menu desktop">
          <router-link to="/dashboard" class="menu-link">
            <el-icon>
              <House />
            </el-icon>
            Dashboard
          </router-link>

          <!-- OPERACIÓN -->
          <el-dropdown>
            <span class="menu-item">
              <el-icon>
                <ShoppingCart />
              </el-icon>
              Operación
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="go('/ventas')">
                  <el-icon>
                    <Money />
                  </el-icon>
                  Ventas
                </el-dropdown-item>
                <el-dropdown-item @click="go('/caja')">
                  <el-icon>
                    <Wallet />
                  </el-icon>
                  Caja
                </el-dropdown-item>
                <el-dropdown-item @click="go('/compras')">
                  <el-icon>
                    <Box />
                  </el-icon>
                  Compras
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- CATALOGOS -->
          <el-dropdown>
            <span class="menu-item">
              <el-icon>
                <Collection />
              </el-icon>
              Catálogos
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="go('/categorias')">
                  <el-icon>
                    <Menu />
                  </el-icon>
                  Categorías
                </el-dropdown-item>
                <el-dropdown-item @click="go('/productos')">
                  <el-icon>
                    <Goods />
                  </el-icon>
                  Productos
                </el-dropdown-item>
                <el-dropdown-item @click="go('/laboratorios')">
                  <el-icon>
                    <Filter />
                  </el-icon>

                  Laboratorios
                </el-dropdown-item>
                <el-dropdown-item @click="go('/presentaciones')">
                  <el-icon>
                    <OfficeBuilding />
                  </el-icon>
                  Presentaciones
                </el-dropdown-item>
                <el-dropdown-item @click="go('/clientes')">
                  <el-icon>
                    <User />
                  </el-icon>

                  Clientes
                </el-dropdown-item>
                <el-dropdown-item @click="go('/proveedores')">
                  <el-icon>
                    <OfficeBuilding />
                  </el-icon>
                  Proveedores
                </el-dropdown-item>
                <el-dropdown-item @click="go('/productos')">
                  <el-icon>
                    <OfficeBuilding />
                  </el-icon>
                  Productos
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- INVENTARIO -->
          <el-dropdown>
            <span class="menu-item">
              <el-icon>
                <Box />
              </el-icon>
              Inventario
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="go('/compraslist')">
                  <el-icon>
                    <DataAnalysis />
                  </el-icon>
                  Compras Realizadas
                </el-dropdown-item>
                <el-dropdown-item @click="go('/stock')">
                  <el-icon>
                    <DataAnalysis />
                  </el-icon>
                  Stock
                </el-dropdown-item>
                <el-dropdown-item @click="go('/kardex')">
                  <el-icon>
                    <Document />
                  </el-icon>
                  Kardex
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- REPORTES -->
          <el-dropdown>
            <span class="menu-item">
              <el-icon>
                <Histogram />
              </el-icon>
              Reportes
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="go('/reportes/ventas')">
                  <el-icon>
                    <TrendCharts />
                  </el-icon>
                  Ventas
                </el-dropdown-item>
                <el-dropdown-item @click="go('/reportes/inventario')">
                  <el-icon>
                    <PieChart />
                  </el-icon>
                  Inventario
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button type="primary">Pos venta</el-button>
        </nav>
      </div>

      <!-- RIGHT -->
      <div class="right">
        <el-input
          v-if="!isMobile"
          placeholder="Buscar..."
          size="small"
          class="search"
        />

        <el-button class="hamburger" text @click="drawer = true">
          ☰
        </el-button>

        <el-avatar size="32">A</el-avatar>
      </div>
    </header>

    <!-- MOBILE DRAWER -->
    <el-drawer
      v-model="drawer"
      direction="ltr"
      size="260px"
      :with-header="false"
    >
      <div class="drawer">
        <!-- HEADER -->
        <div class="drawer-header">💊 <strong>Systfarma</strong></div>

        <!-- MENU -->
        <div class="drawer-menu">
          <router-link @click="close" to="/dashboard">
            <el-icon>
              <House />
            </el-icon>
            Dashboard
          </router-link>

          <div class="group">
            <div class="group-title">Operación</div>
            <router-link @click="close" to="/ventas">
              <el-icon>
                <Money />
              </el-icon>
              Ventas
            </router-link>
            <router-link @click="close" to="/caja">
              <el-icon>
                <Wallet />
              </el-icon>
              Caja
            </router-link>
            <router-link @click="close" to="/compras">
              <el-icon>
                <Box />
              </el-icon>
              Compras
            </router-link>
          </div>

          <div class="group">
            <div class="group-title">Catálogos</div>
            <router-link @click="close" to="/categorias">
              <el-icon>
                <Menu />
              </el-icon>
              Categorías
            </router-link>
            <router-link @click="close" to="/productos">
              <el-icon>
                <Goods />
              </el-icon>
              Productos
            </router-link>
            <router-link @click="close" to="/laboratorios">
              <el-icon>
                <OfficeBuilding />
              </el-icon>
              Laboratorios
            </router-link>
          </div>

          <div class="group">
            <div class="group-title">Inventario</div>
            <router-link @click="close" to="/stock">
              <el-icon>
                <DataAnalysis />
              </el-icon>
              Stock
            </router-link>
            <router-link @click="close" to="/kardex">
              <el-icon>
                <Document />
              </el-icon>
              Kardex
            </router-link>
          </div>

          <div class="group">
            <div class="group-title">Configuración</div>
            <router-link @click="close" to="/configuracion">
              <el-icon>
                <Setting />
              </el-icon>
              Configuración
            </router-link>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- CONTENT -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";

/* ICONOS */
import {
  House,
  Filter,
  ShoppingCart,
  Money,
  Wallet,
  Box,
  Collection,
  Goods,
  Histogram,
  Setting,
  Menu,
  OfficeBuilding,
  DataAnalysis,
  Document,
  TrendCharts,
  PieChart,
  User,
} from "@element-plus/icons-vue";

const router = useRouter();
const drawer = ref(false);

const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);

const go = (path) => router.push(path);
const close = () => (drawer.value = false);
</script>

<style scoped>
/* LAYOUT */
.layout {
  min-height: 100vh;
  background: var(--bg);
}

/* TOPBAR */
.topbar {
  height: 68px;
  background: var(--card);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* LEFT */
.left {
  display: flex;
  align-items: center;
  gap: 36px;
}

/* LOGO */
.logo {
  font-weight: 700;
  font-size: 17px;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

/* MENU */
.menu {
  display: flex;
  align-items: center;
  gap: 22px;
}

.menu-link,
.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: var(--muted);
  padding: 6px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.menu-link.router-link-active,
.menu-item:hover {
  color: var(--primary);
  background: rgba(99, 102, 241, 0.08);
}

/* RIGHT */
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search {
  width: 180px;
}

/* HAMBURGER */
.hamburger {
  display: none;
  font-size: 20px;
}

/* DRAWER */
.drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
}

.drawer-menu {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.drawer-menu a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
}

.drawer-menu a:hover {
  background: rgba(99, 102, 241, 0.08);
}

/* GROUPS */
.group {
  margin-top: 6px;
}

.group-title {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 8px 12px 4px;
}

/* CONTENT */
.content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .desktop {
    display: none;
  }

  .hamburger {
    display: inline-flex;
  }
}
</style>
