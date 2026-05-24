<template>
  <div class="page">
    <el-card shadow="hover" class="card-primary">
      <template #header>
        <div class="card-header-blue">
          Listado de cajas
        </div>
      </template>

      <div class="filters-grid">
        <el-input
          v-model="search"
          placeholder="Buscar caja o usuario"
          clearable
          @keyup.enter="loadAperturas"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button type="primary" @click="loadAperturas">
          Buscar
        </el-button>
      </div>

      <el-table
        :data="aperturas.data"
        border
        stripe
        v-loading="loading"
      >
        <el-table-column type="index" label="#" width="60" />

        <el-table-column label="Caja" min-width="130">
          <template #default="{ row }">
            {{ row.caja?.nombre || "-" }}
          </template>
        </el-table-column>

        <el-table-column label="Usuario" min-width="150">
          <template #default="{ row }">
            {{ row.user?.name || "-" }}
          </template>
        </el-table-column>

        <el-table-column label="Apertura" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.fecha_apertura) }}
          </template>
        </el-table-column>

        <el-table-column label="Cierre" min-width="180">
          <template #default="{ row }">
            {{ row.fecha_cierre ? formatDate(row.fecha_cierre) : "-" }}
          </template>
        </el-table-column>

        <el-table-column label="Saldo inicial" min-width="120" align="right">
          <template #default="{ row }">
            S/ {{ money(row.monto_inicial) }}
          </template>
        </el-table-column>

        <el-table-column label="Total ventas" min-width="120" align="right">
          <template #default="{ row }">
            S/ {{ money(row.total_ventas) }}
          </template>
        </el-table-column>

        <el-table-column label="Total esperado" min-width="130" align="right">
          <template #default="{ row }">
            S/ {{ money(row.total_esperado) }}
          </template>
        </el-table-column>

        <el-table-column label="Monto real" min-width="120" align="right">
          <template #default="{ row }">
            S/ {{ money(row.monto_final) }}
          </template>
        </el-table-column>

        <el-table-column label="Diferencia" min-width="120" align="right">
          <template #default="{ row }">
            <span :class="differenceClass(row.diferencia)">
              S/ {{ money(row.diferencia) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Estado" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.estado ? 'success' : 'info'">
              {{ row.estado ? "Aperturada" : "Cerrada" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Acciones" min-width="240" fixed="right">
          <template #default="{ row }">
            <div class="actions-wrap">
              <el-button
                v-if="row.estado"
                type="warning"
                size="small"
                @click="abrirModalCerrar(row)"
              >
                Cerrar caja
              </el-button>

              <el-button
                type="primary"
                size="small"
                @click="verResumen(row)"
              >
                Resumen
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="paginator">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="aperturas.total || 0"
          :page-size="aperturas.per_page || 10"
          :current-page="page"
          @current-change="changePage"
        />
      </div>
    </el-card>

    <!-- MODAL CERRAR CAJA -->
    <el-dialog
      v-model="dialogCerrar"
      title="Cerrar Caja"
      width="580px"
    >
      <div v-if="resumen.apertura">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Caja">
            {{ resumen.apertura.caja?.nombre || "-" }}
          </el-descriptions-item>

          <el-descriptions-item label="Usuario">
            {{ resumen.apertura.user?.name || "-" }}
          </el-descriptions-item>

          <el-descriptions-item label="Monto inicial">
            S/ {{ money(resumen.monto_inicial) }}
          </el-descriptions-item>

          <el-descriptions-item label="Ventas efectivo">
            S/ {{ money(resumen.ventas_efectivo) }}
          </el-descriptions-item>

          <el-descriptions-item label="Ventas Yape">
            S/ {{ money(resumen.ventas_yape) }}
          </el-descriptions-item>

          <el-descriptions-item label="Ventas Plin">
            S/ {{ money(resumen.ventas_plin) }}
          </el-descriptions-item>

          <el-descriptions-item label="Ventas Tarjeta">
            S/ {{ money(resumen.ventas_tarjeta) }}
          </el-descriptions-item>

          <el-descriptions-item label="Ventas electrónicas">
            S/ {{ money(resumen.total_ventas_electronicas) }}
          </el-descriptions-item>

          <el-descriptions-item label="Total ventas">
            S/ {{ money(resumen.total_ventas) }}
          </el-descriptions-item>

          <el-descriptions-item label="Total esperado en caja">
            <strong>S/ {{ money(resumen.total_esperado) }}</strong>
          </el-descriptions-item>
        </el-descriptions>

        <div class="close-box">
          <el-form label-position="top">
            <el-form-item label="Monto contado real">
              <el-input
                v-model="montoReal"
                type="number"
                placeholder="Ingrese monto contado"
              />
            </el-form-item>

            <div class="difference-box" v-if="montoReal !== ''">
              <div class="difference-row">
                <span>Esperado:</span>
                <strong>S/ {{ money(resumen.total_esperado) }}</strong>
              </div>

              <div class="difference-row">
                <span>Contado:</span>
                <strong>S/ {{ money(montoReal) }}</strong>
              </div>

              <div class="difference-row">
                <span>Diferencia:</span>
                <strong :class="differenceClass(diferenciaCalculada)">
                  S/ {{ money(diferenciaCalculada) }}
                </strong>
              </div>
            </div>
          </el-form>
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogCerrar = false">Cancelar</el-button>
        <el-button
          type="danger"
          :loading="loadingCerrar"
          @click="confirmarCerrarCaja"
        >
          Confirmar cierre
        </el-button>
      </template>
    </el-dialog>

    <!-- MODAL RESUMEN -->
    <el-dialog
      v-model="dialogResumen"
      title="Resumen de Caja"
      width="580px"
    >
      <div v-if="resumen.apertura">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Caja">
            {{ resumen.apertura.caja?.nombre || "-" }}
          </el-descriptions-item>

          <el-descriptions-item label="Usuario">
            {{ resumen.apertura.user?.name || "-" }}
          </el-descriptions-item>

          <el-descriptions-item label="Monto inicial">
            S/ {{ money(resumen.monto_inicial) }}
          </el-descriptions-item>

          <el-descriptions-item label="Ventas efectivo">
            S/ {{ money(resumen.ventas_efectivo) }}
          </el-descriptions-item>

          <el-descriptions-item label="Ventas Yape">
            S/ {{ money(resumen.ventas_yape) }}
          </el-descriptions-item>

          <el-descriptions-item label="Ventas Plin">
            S/ {{ money(resumen.ventas_plin) }}
          </el-descriptions-item>

          <el-descriptions-item label="Ventas Tarjeta">
            S/ {{ money(resumen.ventas_tarjeta) }}
          </el-descriptions-item>

          <el-descriptions-item label="Ventas electrónicas">
            S/ {{ money(resumen.total_ventas_electronicas) }}
          </el-descriptions-item>

          <el-descriptions-item label="Total ventas">
            S/ {{ money(resumen.total_ventas) }}
          </el-descriptions-item>

          <el-descriptions-item label="Total esperado">
            S/ {{ money(resumen.total_esperado) }}
          </el-descriptions-item>

          <el-descriptions-item label="Monto real">
            S/ {{ money(resumen.monto_real) }}
          </el-descriptions-item>

          <el-descriptions-item label="Diferencia">
            <strong :class="differenceClass(resumen.diferencia)">
              S/ {{ money(resumen.diferencia) }}
            </strong>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { Search } from "@element-plus/icons-vue"
import {
  getAperturasCaja,
  getResumenCaja,
  cerrarCaja
} from "@/services/cajas"

const aperturas = ref({ data: [] })
const loading = ref(false)
const loadingCerrar = ref(false)
const page = ref(1)
const search = ref("")

const dialogCerrar = ref(false)
const dialogResumen = ref(false)

const resumen = ref({})
const montoReal = ref("")

const money = (value) => Number(value || 0).toFixed(2)

const formatDate = (value) => {
  if (!value) return "-"
  return new Date(value).toLocaleString()
}

const differenceClass = (value) => {
  const num = Number(value || 0)
  if (num > 0) return "positive"
  if (num < 0) return "negative"
  return "neutral"
}

const diferenciaCalculada = computed(() => {
  const real = Number(montoReal.value || 0)
  const esperado = Number(resumen.value.total_esperado || 0)
  return real - esperado
})

const loadAperturas = async () => {
  loading.value = true
  try {
    const { data } = await getAperturasCaja({
      page: page.value,
      search: search.value
    })
    aperturas.value = data
  } catch (error) {
    ElMessage.error("Error al cargar aperturas de caja")
  } finally {
    loading.value = false
  }
}

const changePage = (p) => {
  page.value = p
  loadAperturas()
}

const abrirModalCerrar = async (row) => {
  try {
    const { data } = await getResumenCaja(row.id)
    resumen.value = data
    montoReal.value = ""
    dialogCerrar.value = true
  } catch (error) {
    ElMessage.error("No se pudo cargar el resumen de caja")
  }
}

const verResumen = async (row) => {
  try {
    const { data } = await getResumenCaja(row.id)
    resumen.value = data
    dialogResumen.value = true
  } catch (error) {
    ElMessage.error("No se pudo cargar el resumen")
  }
}

const confirmarCerrarCaja = async () => {
  if (montoReal.value === "" || Number(montoReal.value) < 0) {
    ElMessage.error("Ingrese un monto válido")
    return
  }

  try {
    await ElMessageBox.confirm(
      "¿Seguro que desea cerrar la caja?",
      "Confirmación",
      { type: "warning" }
    )

    loadingCerrar.value = true

    const { data } = await cerrarCaja({
      apertura_id: resumen.value.apertura.id,
      monto_real: Number(montoReal.value)
    })

    ElMessage.success(data.message || "Caja cerrada correctamente")
    dialogCerrar.value = false

    const aperturaIdActual = localStorage.getItem("apertura_id")
    if (String(aperturaIdActual) === String(resumen.value.apertura.id)) {
      localStorage.removeItem("apertura_id")
    }

    await loadAperturas()
  } catch (error) {
    if (error !== "cancel") {
      const msg =
        error?.response?.data?.message ||
        "Error al cerrar caja"
      ElMessage.error(msg)
    }
  } finally {
    loadingCerrar.value = false
  }
}

onMounted(() => {
  loadAperturas()
})
</script>

<style scoped>
.page {
  max-width: 1400px;
  margin: auto;
}

.card-header-blue {
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  color: white;
  font-weight: 700;
  padding: 14px 18px;
  border-radius: 8px;
  font-size: 16px;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.paginator {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.actions-wrap {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.close-box {
  margin-top: 18px;
}

.difference-box {
  background: #f5f7fa;
  padding: 14px;
  border-radius: 10px;
  font-size: 15px;
}

.difference-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.positive {
  color: #16a34a;
  font-weight: 700;
}

.negative {
  color: #dc2626;
  font-weight: 700;
}

.neutral {
  color: #374151;
  font-weight: 700;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .actions-wrap {
    flex-direction: column;
  }
}
</style>