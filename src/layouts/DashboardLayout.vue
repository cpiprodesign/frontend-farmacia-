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
            <el-icon><House /></el-icon>
            Dashboard
          </router-link>

          <!-- OPERACIÓN -->
          <el-dropdown>
            <span class="menu-item">
              <el-icon><ShoppingCart /></el-icon>
              Operación
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="go('/ventas')">
                  <el-icon><Money /></el-icon>
                  Ventas
                </el-dropdown-item>
                <el-dropdown-item @click="go('/listado-cajas')">
                  <el-icon><Wallet /></el-icon>
                  Caja
                </el-dropdown-item>
                <el-dropdown-item @click="go('/compras')">
                  <el-icon><Box /></el-icon>
                  Compras
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- CATÁLOGOS -->
          <el-dropdown>
            <span class="menu-item">
              <el-icon><Collection /></el-icon>
              Catálogos
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="go('/categorias')">
                  <el-icon><Menu /></el-icon>
                  Categorías
                </el-dropdown-item>
                <el-dropdown-item @click="go('/productos')">
                  <el-icon><Goods /></el-icon>
                  Productos
                </el-dropdown-item>
                <el-dropdown-item @click="go('/laboratorios')">
                  <el-icon><Filter /></el-icon>
                  Laboratorios
                </el-dropdown-item>
                <el-dropdown-item @click="go('/presentaciones')">
                  <el-icon><OfficeBuilding /></el-icon>
                  Presentaciones
                </el-dropdown-item>
                <el-dropdown-item @click="go('/clientes')">
                  <el-icon><User /></el-icon>
                  Clientes
                </el-dropdown-item>
                <el-dropdown-item @click="go('/proveedores')">
                  <el-icon><OfficeBuilding /></el-icon>
                  Proveedores
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- INVENTARIO -->
          <el-dropdown>
            <span class="menu-item">
              <el-icon><Box /></el-icon>
              Inventario
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="go('/ventaslist')">
                  <el-icon><DataAnalysis /></el-icon>
                  Ventas Realizadas
                </el-dropdown-item>
                <el-dropdown-item @click="go('/compraslist')">
                  <el-icon><DataAnalysis /></el-icon>
                  Compras Realizadas
                </el-dropdown-item>
                <el-dropdown-item @click="go('/stock')">
                  <el-icon><DataAnalysis /></el-icon>
                  Stock
                </el-dropdown-item>
                <el-dropdown-item @click="go('/kardex')">
                  <el-icon><Document /></el-icon>
                  Kardex
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- REPORTES -->
          <el-dropdown>
            <span class="menu-item">
              <el-icon><Histogram /></el-icon>
              Reportes
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="go('/reportes/ventas')">
                  <el-icon><TrendCharts /></el-icon>
                  Ventas
                </el-dropdown-item>
                <el-dropdown-item @click="go('/reportes/inventario')">
                  <el-icon><PieChart /></el-icon>
                  Inventario
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button @click="go('/ventas')" type="primary">Pos venta</el-button>
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

        <div class="top-user-menu">
          <el-dropdown trigger="click" placement="bottom-end">
            <div class="user-trigger">
              <el-icon class="user-icon"><UserFilled /></el-icon>
              <span class="user-name">{{ userName }}</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </div>

            <template #dropdown>
              <el-dropdown-menu class="custom-dropdown">
                <div class="dropdown-title">Cuenta</div>

                <el-dropdown-item @click="irPerfil" class="dropdown-item-custom">
                  <el-icon class="item-icon"><UserFilled /></el-icon>
                  <span>Perfil</span>
                </el-dropdown-item>

                <el-dropdown-item
                  divided
                  @click="dialogLogout = true"
                  class="dropdown-item-custom"
                >
                  <el-icon class="item-icon"><Lock /></el-icon>
                  <span>Cerrar sesión</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dialog
            v-model="dialogLogout"
            title="Cerrar sesión"
            width="350px"
            align-center
          >
            <span>¿Seguro que deseas cerrar sesión?</span>

            <template #footer>
              <div class="dialog-footer">
                <el-button @click="dialogLogout = false">Cancelar</el-button>
                <el-button type="danger" @click="logout">
                  Cerrar sesión
                </el-button>
              </div>
            </template>
          </el-dialog>
        </div>
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
        <div class="drawer-header">💊 <strong>Systfarma</strong></div>

        <div class="drawer-menu">
          <router-link @click="close" to="/dashboard">
            <el-icon><House /></el-icon>
            Dashboard
          </router-link>

          <div class="group">
            <div class="group-title">Operación</div>
            <router-link @click="close" to="/ventas">
              <el-icon><Money /></el-icon>
              Ventas
            </router-link>
            <router-link @click="close" to="/caja">
              <el-icon><Wallet /></el-icon>
              Caja
            </router-link>
            <router-link @click="close" to="/compras">
              <el-icon><Box /></el-icon>
              Compras
            </router-link>
          </div>

          <div class="group">
            <div class="group-title">Catálogos</div>
            <router-link @click="close" to="/categorias">
              <el-icon><Menu /></el-icon>
              Categorías
            </router-link>
            <router-link @click="close" to="/productos">
              <el-icon><Goods /></el-icon>
              Productos
            </router-link>
            <router-link @click="close" to="/laboratorios">
              <el-icon><OfficeBuilding /></el-icon>
              Laboratorios
            </router-link>
          </div>

          <div class="group">
            <div class="group-title">Inventario</div>
            <router-link @click="close" to="/stock">
              <el-icon><DataAnalysis /></el-icon>
              Stock
            </router-link>
            <router-link @click="close" to="/kardex">
              <el-icon><Document /></el-icon>
              Kardex
            </router-link>
          </div>

          <div class="group">
            <div class="group-title">Configuración</div>
            <router-link @click="close" to="/configuracion">
              <el-icon><Setting /></el-icon>
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
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useWindowSize } from "@vueuse/core"
import { ElMessage } from "element-plus"

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
  UserFilled,
  ArrowDown,
  Lock,
} from "@element-plus/icons-vue"

const router = useRouter()
const drawer = ref(false)
const dialogLogout = ref(false)

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const user = computed(() => {
  const data = localStorage.getItem("user")
  return data ? JSON.parse(data) : null
})

const userName = computed(() => {
  return user.value?.name || user.value?.nom_usu || "admin"
})

const go = (path) => router.push(path)
const close = () => {
  drawer.value = false
}

const irPerfil = () => {
  ElMessage.info("Perfil en construcción")
  // router.push('/perfil')
}

const logout = async () => {
  const token = localStorage.getItem("token")

  try {
    await axios.post(
      "https://127.0.0.1:8000/api/logout",
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
      }
    )
  } catch (error) {
    console.log("Error al cerrar sesión en backend", error)
  } finally {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("sucursal_id")
    localStorage.removeItem("caja_id")
    localStorage.removeItem("apertura_id")

    dialogLogout.value = false
    ElMessage.success("Sesión cerrada correctamente")
    router.push("/login")
  }
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: var(--bg);
}

.topbar {
  height: 68px;
  background: var(--card);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.left {
  display: flex;
  align-items: center;
  gap: 36px;
}

.logo {
  font-weight: 700;
  font-size: 17px;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

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

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search {
  width: 180px;
}

.hamburger {
  display: none;
  font-size: 20px;
}

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

.content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}

.top-user-menu {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #5f6f7f;
  font-size: 18px;
  user-select: none;
  padding: 6px 10px;
  border-radius: 10px;
  transition: 0.2s;
}

.user-trigger:hover {
  background: #f5f7fa;
}

.user-icon {
  font-size: 24px;
  color: #5f6f7f;
}

.user-name {
  font-size: 18px;
  color: #5f6f7f;
}

.arrow-icon {
  font-size: 14px;
  color: #5f6f7f;
}

:deep(.custom-dropdown) {
  width: 220px;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
}

.dropdown-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #6b7280;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

:deep(.dropdown-item-custom) {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  padding: 16px 20px;
  color: #2f2f2f;
}

.item-icon {
  font-size: 22px;
  color: #c0c4cc;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .desktop {
    display: none;
  }

  .hamburger {
    display: inline-flex;
  }

  .topbar {
    padding: 0 14px;
  }

  .left {
    gap: 12px;
  }

  .user-name {
    display: none;
  }
}
</style>