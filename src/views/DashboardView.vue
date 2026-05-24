<template>
    <div class="dashboard-container">

        <!-- HEADER -->
         <div class="welcome-card">

  <div class="welcome-card-small">

  <div class="welcome-user">

    <div class="avatar-mini">
      {{ inicialUsuario }}
    </div>

    <div>

      <h2>
        Bienvenido,
        {{ user?.name }}
        👋
      </h2>

      <p>
        Administrador del sistema
      </p>

    </div>

  </div>

  <div class="welcome-actions">

    <div class="date-badge">
      <i class="fas fa-calendar"></i>
      {{ fechaLarga }}
    </div>

  </div>

</div>

  <div class="welcome-right">

    <div class="welcome-badge">
      <i class="fas fa-chart-line"></i>
      Dashboard farmacia
    </div>

  </div>

</div>
        <!-- <div class="dashboard-header">

            <div>
                <h1>Dashboard</h1>
                <p>Resumen general del negocio</p>
            </div>

            <div class="dashboard-date">
                {{ fechaActual }}
            </div>

        </div> -->

        <!-- KPIs -->
        <el-row :gutter="20">

            <el-col :xs="24" :sm="12" :md="12" :lg="6">
                <el-card shadow="hover" class="kpi-card ventas-card">

                    <div class="kpi-body">

                        <div>
                            <span class="kpi-title">
                                Ventas hoy
                            </span>

                            <h2>
                                S/ {{ dashboard.ventas_hoy || 0 }}
                            </h2>
                        </div>

                        <div class="kpi-icon">
                            <i class="fas fa-cash-register"></i>
                        </div>

                    </div>

                </el-card>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="6">
                <el-card shadow="hover" class="kpi-card mes-card">

                    <div class="kpi-body">

                        <div>
                            <span class="kpi-title">
                                Ventas mes
                            </span>

                            <h2>
                                S/ {{ dashboard.ventas_mes || 0 }}
                            </h2>
                        </div>

                        <div class="kpi-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>

                    </div>

                </el-card>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="6">
                <el-card shadow="hover" class="kpi-card compra-card">

                    <div class="kpi-body">

                        <div>
                            <span class="kpi-title">
                                Compras mes
                            </span>

                            <h2>
                                S/ {{ dashboard.compras_mes || 0 }}
                            </h2>
                        </div>

                        <div class="kpi-icon">
                            <i class="fas fa-cart-shopping"></i>
                        </div>

                    </div>

                </el-card>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="6">
                <el-card shadow="hover" class="kpi-card utilidad-card">

                    <div class="kpi-body">

                        <div>
                            <span class="kpi-title">
                                Utilidad
                            </span>

                            <h2>
                                S/ {{ dashboard.utilidad || 0 }}
                            </h2>
                        </div>

                        <div class="kpi-icon">
                            <i class="fas fa-wallet"></i>
                        </div>

                    </div>

                </el-card>
            </el-col>

        </el-row>

        <!-- GRAFICOS -->
        <el-row :gutter="20">

            <el-col :xs="24" :lg="16">

                <el-card shadow="never" class="dashboard-card chart-card">

                    <template #header>

                        <div class="card-header">
                            <span>
                                📈 Ventas vs Compras
                            </span>

                            <small>Últimos 7 días</small>
                        </div>

                    </template>

                    <canvas ref="chartVentas"></canvas>

                </el-card>

            </el-col>

            <el-col :xs="24" :lg="8">

                <el-card shadow="never" class="dashboard-card chart-card">

                    <template #header>

                        <div class="card-header">
                            <span>
                                💳 Métodos de pago
                            </span>
                        </div>

                    </template>

                    <canvas ref="chartMetodos"></canvas>

                </el-card>

            </el-col>

        </el-row>

        <!-- CAJA + VENTAS -->
        <el-row :gutter="20">

            <el-col :xs="24" :lg="8">

                <el-card shadow="never" class="dashboard-card">

                    <template #header>

                        <div class="card-header">
                            <span>💰 Caja actual</span>
                        </div>

                    </template>

                    <div v-if="dashboard.caja">

                        <div class="box-item">
                            <span>Caja</span>
                            <strong>
                                {{ dashboard.caja.caja?.nombre }}
                            </strong>
                        </div>

                        <div class="box-item">
                            <span>Usuario</span>
                            <strong>
                                {{ dashboard.caja.user?.name }}
                            </strong>
                        </div>

                        <div class="box-item">
                            <span>Monto inicial</span>
                            <strong>
                                S/ {{ dashboard.caja.monto_inicial }}
                            </strong>
                        </div>

                        <div class="box-item">
                            <span>Estado</span>

                            <el-tag type="success">
                                ABIERTA
                            </el-tag>
                        </div>

                        <el-button type="danger" class="btn-cerrar">
                            🔒 Cerrar Caja
                        </el-button>

                    </div>

                    <el-empty v-else description="No hay caja abierta" />

                </el-card>

            </el-col>

            <el-col :xs="24" :lg="16">

                <el-card shadow="never" class="dashboard-card">

                    <template #header>

                        <div class="card-header">
                            <span>🧾 Últimas ventas</span>
                        </div>

                    </template>

                    <el-table :data="dashboard.ultimas_ventas" stripe>

                        <el-table-column type="index" width="60" />

                        <el-table-column label="Cliente">
                            <template #default="scope">
                                {{
                                    scope.row.cliente?.nombre ||
                                'Cliente general'
                                }}
                            </template>
                        </el-table-column>

                        <el-table-column label="Comprobante">

                            <template #default="scope">

                                <el-tag type="info" effect="plain" round>

                                    {{
                                        scope.row.documento?.nombre
                                    }}

                                </el-tag>

                            </template>

                        </el-table-column>

                        <el-table-column label="Método">
                            <template #default="scope">

                                <el-tag size="small">
                                    {{ scope.row.metodo_pago }}
                                </el-tag>

                            </template>
                        </el-table-column>

                        <el-table-column label="Total">
                            <template #default="scope">
                                S/ {{ scope.row.total }}
                            </template>
                        </el-table-column>

                    </el-table>

                </el-card>

            </el-col>

        </el-row>

        <!-- STOCK -->
        <el-row :gutter="20">

            <el-col :xs="24" :lg="12">

                <el-card shadow="never" class="dashboard-card">

                    <template #header>

                        <div class="card-header">
                            🔥 Top productos vendidos
                        </div>

                    </template>

                    <el-table :data="dashboard.top_productos" stripe>

                        <el-table-column type="index" width="60" />

                        <el-table-column prop="producto" label="Producto" />

                        <el-table-column label="Cantidad" width="120">

                            <template #default="scope">

                                <el-tag type="success" size="large">
                                    {{ scope.row.cantidad }}
                                </el-tag>

                            </template>

                        </el-table-column>

                    </el-table>

                </el-card>

            </el-col>

            <el-col :xs="24" :lg="12">

                <el-card shadow="never" class="dashboard-card">

                    <template #header>

                        <div class="card-header">
                            ⚠️ Stock bajo
                        </div>

                    </template>

                    <el-table :data="dashboard.stock_bajo" stripe>

                        <el-table-column type="index" width="60" />

                        <el-table-column prop="descripcion" label="Producto" />

                        <el-table-column label="Stock" width="120">

                            <template #default="scope">

                                <el-tag :type="stockColor(scope.row.stock)" size="large">
                                    {{ scope.row.stock }}
                                </el-tag>

                            </template>

                        </el-table-column>

                    </el-table>

                </el-card>

            </el-col>

        </el-row>

        <!-- VENCIMIENTOS -->
        <el-row :gutter="20">

            <el-col :xs="24">

                <el-card shadow="never" class="dashboard-card">

                    <template #header>

                        <div class="card-header">
                            🚨 Productos próximos a vencer
                        </div>

                    </template>

                    <el-table :data="dashboard.productos_vencer" stripe>

                        <el-table-column type="index" width="60" />

                        <el-table-column prop="descripcion" label="Producto" />

                        <el-table-column prop="lote" label="Lote" width="120" />

                        <el-table-column prop="cantidad" label="Stock" width="100" />

                        <el-table-column prop="fecha_vencimiento" label="Vence" />

                        <el-table-column label="Estado" width="180">

                            <template #default="scope">

                                <el-tag :type="vencimientoColor(
                                    scope.row.dias_restantes
                                )
                                    " size="large">

                                    {{
                                        vencimientoTexto(
                                            scope.row.dias_restantes
                                    )
                                    }}

                                </el-tag>

                            </template>

                        </el-table-column>

                    </el-table>

                </el-card>

            </el-col>

        </el-row>

    </div>
</template>

<script setup>
import {
    ref,
    onMounted,
    nextTick,
    computed
} from "vue"

import axios from "axios"
import Chart from "chart.js/auto"

const dashboard = ref({})

const chartVentas = ref(null)
const chartMetodos = ref(null)

let chartInstance = null
let donutInstance = null
const user = computed(() => {
  return JSON.parse(
    localStorage.getItem("user")
  )
})

const inicialUsuario = computed(() => {
  return user.value?.name
    ?.charAt(0)
    ?.toUpperCase()
})
const fechaLarga = computed(() => {

  return new Date().toLocaleDateString(
    'es-PE',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  )

})
const fechaActual = computed(() => {
    return new Date().toLocaleDateString()
})


const stockColor = (stock) => {

    if (stock <= 2) return "danger"

    if (stock <= 5) return "warning"

    return "info"
}

const vencimientoColor = (dias) => {

    if (dias <= 7) return "danger"

    if (dias <= 15) return "warning"

    return "success"
}

const vencimientoTexto = (dias) => {

    if (dias < 0) {
        return "VENCIDO"
    }

    if (dias <= 7) {
        return `Vence en ${dias} días`
    }

    if (dias <= 15) {
        return `Próximo (${dias} días)`
    }

    return `${dias} días`
}

const getDashboard = async () => {

    try {

        const token = localStorage.getItem("token")

        const res = await axios.get(
            "https://api-farmacia.test/api/dashboard",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        dashboard.value = res.data

        await generarGrafico()
        await generarDonut()

    } catch (error) {
        console.error(error)
    }
}

const generarGrafico = async () => {

    await nextTick()

    if (!chartVentas.value) return

    if (chartInstance) {
        chartInstance.destroy()
    }

    const labels = dashboard.value.ventas_semana.map(
        item => item.fecha
    )

    const ventas = dashboard.value.ventas_semana.map(
        item => item.total
    )

    const compras = dashboard.value.compras_semana.map(
        item => item.total
    )

    chartInstance = new Chart(
        chartVentas.value,
        {
            type: "line",

            data: {
                labels,

                datasets: [
                    {
                        label: "Ventas",
                        data: ventas,
                        tension: 0.4
                    },

                    {
                        label: "Compras",
                        data: compras,
                        tension: 0.4
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    )
}

const generarDonut = async () => {

    await nextTick()

    if (!chartMetodos.value) return

    if (donutInstance) {
        donutInstance.destroy()
    }

    const labels = dashboard.value.metodos.map(
        item => item.metodo_pago
    )

    const values = dashboard.value.metodos.map(
        item => item.total
    )

    donutInstance = new Chart(
        chartMetodos.value,
        {
            type: "doughnut",

            data: {
                labels,

                datasets: [
                    {
                        data: values,
                        borderWidth: 0
                    }
                ]
            },

            options: {
                responsive: true
            }
        }
    )
}

onMounted(() => {
    getDashboard()
})
</script>

<style scoped>
.welcome-card-small{
    background:white;
    border-radius:24px;
    padding:18px 24px;

    display:flex;
    justify-content:space-between;
    align-items:center;

    margin-bottom:22px;

    box-shadow:
    0 8px 25px rgba(0,0,0,.04);

    border:1px solid #eef2f7;
}

.welcome-user{
    display:flex;
    align-items:center;
    gap:16px;
}

.avatar-mini{
    width:56px;
    height:56px;
    border-radius:18px;

    background:
    linear-gradient(
        135deg,
        #2563eb,
        #4f46e5
    );

    display:flex;
    justify-content:center;
    align-items:center;

    color:white;
    font-size:24px;
    font-weight:800;

    box-shadow:
    0 10px 25px
    rgba(37,99,235,.2);
}

.welcome-card-small h2{
    margin:0;
    font-size:24px;
    font-weight:700;
    color:#111827;
}

.welcome-card-small p{
    margin:4px 0 0;
    color:#6b7280;
    font-size:14px;
}

.date-badge{
    background:#f3f6fb;
    color:#374151;

    padding:12px 18px;
    border-radius:14px;

    display:flex;
    align-items:center;
    gap:10px;

    font-weight:600;
    font-size:14px;
}

.date-badge i{
    color:#2563eb;
}

@media(max-width:768px){

    .welcome-card-small{
        flex-direction:column;
        align-items:flex-start;
        gap:14px;
    }

    .welcome-card-small h2{
        font-size:20px;
    }

    .avatar-mini{
        width:50px;
        height:50px;
    }

}
.welcome-card{
    background:
    linear-gradient(
        135deg,
        #2563eb,
        #4f46e5
    );

    border-radius:32px;
    padding:35px;
    margin-bottom:30px;

    display:flex;
    justify-content:space-between;
    align-items:center;

    color:white;

    box-shadow:
    0 15px 40px
    rgba(37,99,235,.25);
}

.welcome-left{
    display:flex;
    align-items:center;
    gap:22px;
}

.avatar-box{
    width:85px;
    height:85px;
    border-radius:24px;

    background:
    rgba(255,255,255,.15);

    backdrop-filter: blur(10px);

    display:flex;
    justify-content:center;
    align-items:center;

    font-size:34px;
    font-weight:800;
}

.welcome-card h1{
    margin:0;
    font-size:40px;
    font-weight:800;
}

.welcome-role{
    margin-top:8px;
    font-size:18px;
    opacity:.92;
}

.welcome-date{
    display:inline-block;
    margin-top:12px;
    padding:8px 16px;
    border-radius:14px;

    background:
    rgba(255,255,255,.12);

    font-size:14px;
}

.welcome-badge{
    background:
    rgba(255,255,255,.15);

    padding:14px 22px;
    border-radius:18px;

    display:flex;
    align-items:center;
    gap:10px;

    font-weight:700;
}

.welcome-badge i{
    font-size:20px;
}

@media(max-width:768px){

    .welcome-card{
        flex-direction:column;
        align-items:flex-start;
        gap:25px;
        padding:28px;
        border-radius:26px;
    }

    .welcome-left{
        flex-direction:column;
        align-items:flex-start;
    }

    .welcome-card h1{
        font-size:30px;
    }

    .avatar-box{
        width:65px;
        height:65px;
        font-size:28px;
    }
}
.dashboard-container {
    padding: 28px;
    background: #f4f7fb;
    min-height: 100vh;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
}

.dashboard-header h1 {
    font-size: 34px;
    font-weight: 800;
    margin: 0;
    color: #111827;
}

.dashboard-header p {
    color: #6b7280;
    margin-top: 6px;
}

.dashboard-date {
    background: white;
    padding: 14px 18px;
    border-radius: 18px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, .04);
    font-weight: 700;
}

.kpi-card {
    border: none !important;
    border-radius: 24px !important;
    overflow: hidden;
    margin-bottom: 20px;
    color: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, .06);
}

.kpi-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.kpi-title {
    font-size: 14px;
    opacity: .9;
}

.kpi-body h2 {
    margin-top: 10px;
    font-size: 34px;
    font-weight: 800;
}

.kpi-icon {
    width: 68px;
    height: 68px;
    border-radius: 20px;
    background: rgba(255, 255, 255, .18);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(10px);
}

.kpi-icon i {
    font-size: 28px;
    color: white;
}

.ventas-card {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.mes-card {
    background: linear-gradient(135deg, #10b981, #059669);
}

.compra-card {
    background: linear-gradient(135deg, #f59e0b, #d97706);
}

.utilidad-card {
    background: linear-gradient(135deg, #ef4444, #dc2626);
}

.dashboard-card {
    border: none !important;
    border-radius: 28px !important;
    margin-bottom: 24px;
    box-shadow: 0 10px 35px rgba(0, 0, 0, .05);
}

.chart-card {
    min-height: 470px;
}

canvas {
    height: 340px !important;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    color: #111827;
}

.box-item {
    background: #f9fafb;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
}

.box-item span {
    color: #6b7280;
}

.btn-cerrar {
    width: 100%;
    height: 52px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 700;
    margin-top: 18px;
}

:deep(.el-table) {
    border-radius: 18px;
    overflow: hidden;
}

:deep(.el-table th) {
    background: #f8fafc !important;
    color: #374151;
    font-weight: 700;
}

:deep(.el-table td) {
    padding: 14px 0;
}

@media(max-width:768px) {

    .dashboard-container {
        padding: 14px;
    }

    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
    }

    .dashboard-header h1 {
        font-size: 28px;
    }

    .kpi-body h2 {
        font-size: 26px;
    }

    canvas {
        height: 280px !important;
    }

}
</style>