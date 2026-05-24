<template>
  <AppCard title="Orden de compra ">
    <div class="page">
      <div class="compra-header">
        <h2>Nueva Compra</h2>
        <el-button type="success" @click="$router.push('/compraslist/')">
          Ver compras
        </el-button>
      </div>
      <!-- DATOS -->
      <el-card class="mb">
        <div class="grid">
          <el-form-item label="Proveedor">
            <el-select v-model="form.proveedor_id" clearable>
              <el-option v-for="p in proveedores" :key="p.id" :label="p.nombre" :value="p.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Sucursal">
            <el-select v-model="form.sucursal_id">
              <el-option v-for="s in sucursales" :key="s.id" :label="s.nombre" :value="s.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Fecha">
            <el-date-picker v-model="form.fecha" type="date" />
          </el-form-item>
        </div>
      </el-card>
      <!-- AGREGAR PRODUCTO -->
      <el-card class="mb">
        <div class="grid">
          <el-select v-model="item.producto_id" placeholder="Producto">
            <el-option v-for="p in productos" :key="p.id" :label="p.descripcion" :value="p.id" />
          </el-select>
          <el-input-number v-model="item.cantidad" :min="1" />
          <el-input-number v-model="item.precio" :min="0" />
          <el-input v-model="item.lote" placeholder="Lote" />
          <el-date-picker v-model="item.fecha_vencimiento" type="date" placeholder="Vencimiento" />
          <el-button type="primary" @click="addItem">
            <!-- <font-awesome-icon icon="plus" class="mr-2" /> -->
            <!-- Agregar -->
            <el-icon>
              <CirclePlusFilled />
            </el-icon>
            Agregar
          </el-button>
        </div>
      </el-card>
      <!-- TABLA DETALLE -->
      <el-card>
        <el-table :data="form.items" border>
          <el-table-column prop="producto_nombre" label="Producto" />
          <el-table-column prop="cantidad" label="Cant" />
          <el-table-column prop="precio" label="Precio" />
          <el-table-column prop="subtotal" label="Subtotal" />
          <el-table-column prop="lote" label="Lote" />
          <el-table-column
  label="Vence"
>
  <template #default="{ row }">
    {{ formatFecha(row.fecha_vencimiento) }}
  </template>
</el-table-column>
          <el-table-column label="Acciones" width="120">
            <template #default="{ row, $index }">
              <el-button size="small" type="danger" @click="removeItem($index)">
                Quitar
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="totales">
          <div>Subtotal: {{ subtotal.toFixed(2) }}</div>
          <div>IGV: {{ igv.toFixed(2) }}</div>
          <div>Total: {{ total.toFixed(2) }}</div>
        </div>
        <div class="actions">
          <el-button type="primary" :loading="loadingSave" :disabled="loadingSave" @click="save">
            Guardar Compra
          </el-button>
        </div>
      </el-card>
    </div>
  </AppCard>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
/* ICONOS */
import {
  CirclePlus,
  SuccessFilled,
  Plus,
  CirclePlusFilled,
  House,
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
} from "@element-plus/icons-vue";
import { createCompra } from "../services/compras";
import { getProveedores } from "../services/proveedores";
import { getProductos } from "../services/productos";
import { getSucursales } from "../services/sucursales";
import AppCard from "@/components/AppCard.vue";
const proveedores = ref([]);
const productos = ref([]);
const sucursales = ref([]);
const loadingSave = ref(false);

const form = ref({
  proveedor_id: null,
  sucursal_id: null,
  fecha: new Date(),
  items: [],
});

const item = ref({
  producto_id: null,
  producto_nombre: "",
  cantidad: 1,
  precio: 0,
  subtotal: 0,
  lote: "",
  fecha_vencimiento: null,
});

const subtotal = computed(() => {
  return Number(
    form.value.items
      .reduce(
        (a, b) => a + Number(b.subtotal),
        0
      )
      .toFixed(2)
  )
})

const igv = computed(() => {
  return Number(
    (subtotal.value * 0.18)
      .toFixed(2)
  )
})

const total = computed(() => {
  return Number(
    (subtotal.value + igv.value)
      .toFixed(2)
  )
})
const formatFecha = (fecha) => {
  if (!fecha) return "-"

  return new Date(fecha)
    .toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
}

const addItem = () => {
  if (!item.value.producto_id) return;

  const prod = productos.value.find((p) => p.id === item.value.producto_id);

  form.value.items.push({
    ...item.value,
    producto_nombre: prod?.descripcion,
    subtotal: item.value.cantidad * item.value.precio,
  });

  item.value = {
    producto_id: null,
    cantidad: 1,
    precio: 0,
    lote: "",
    fecha_vencimiento: null,
  };
};

const removeItem = (i) => {
  form.value.items.splice(i, 1);
};

const save = async () => {
  if (loadingSave.value) return; // 👉 evita doble click

  loadingSave.value = true;

  try {
    await createCompra({
      ...form.value,
      subtotal: subtotal.value,
      igv: igv.value,
      total: total.value,
    });

    ElMessage.success("Compra registrada");

    form.value.items = [];
  } catch (e) {
    ElMessage.error("Error al guardar");
  } finally {
    loadingSave.value = false;
  }
};

onMounted(async () => {
  proveedores.value = (await getProveedores()).data.data;
  productos.value = (await getProductos()).data.data;
  sucursales.value = (await getSucursales()).data;
});
</script>
<style scoped>
.page {
  max-width: 1200px;
  margin: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.mb {
  margin-bottom: 20px;
}

.totales {
  margin-top: 20px;
  font-size: 18px;
  display: flex;
  gap: 20px;
}

.actions {
  margin-top: 20px;
}

.compra-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

/* 📱 móvil */
@media (max-width: 768px) {
  .compra-header {
    flex-direction: column;
    align-items: stretch;
  }

  .compra-header .el-button {
    width: 100%;
  }
}
</style>
