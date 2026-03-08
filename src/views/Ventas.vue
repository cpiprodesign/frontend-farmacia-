<template>
  <div class="page">
    <!-- HEADER -->
    <div class="page-header">
      <h2>Nueva Venta</h2>

      <el-button type="success" @click="$router.push('/ventas-list')">
        Ver ventas
      </el-button>
    </div>

    <!-- CARD -->
    <el-card shadow="hover">
      <!-- DATOS -->
      <div class="form-grid">
        <el-form-item label="Documento">
          <el-select v-model="form.documento_id" placeholder="Documento">
            <el-option
              v-for="d in documentos"
              :key="d.id"
              :label="d.nombre"
              :value="d.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Cliente">
          <el-select v-model="form.cliente_id" filterable>
            <el-option
              v-for="c in clientes"
              :key="c.id"
              :label="c.nombre"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
      </div>

      <!-- PRODUCTOS -->
      <el-divider>Productos</el-divider>

      <div class="form-grid">
        <el-select
          v-model="productoSeleccionado"
          filterable
          placeholder="Buscar producto"
          style="width: 100%"
        >
          <el-option
            v-for="p in productos"
            :key="p.id"
            :label="p.descripcion"
            :value="p"
          />
        </el-select>

        <el-input-number v-model="cantidad" :min="1" />
      </div>

      <el-button type="primary" class="mt" @click="addItem">
        Agregar
      </el-button>

      <!-- TABLA -->
      <el-table :data="form.items" stripe border class="mt">
        <el-table-column prop="descripcion" label="Producto" />

        <el-table-column prop="cantidad" label="Cant" width="90" />

        <el-table-column prop="precio" label="Precio" width="120" />

        <el-table-column prop="subtotal" label="Subtotal" width="120" />

        <el-table-column label="" width="80">
          <template #default="{ $index }">
            <el-button type="danger" size="small" @click="removeItem($index)">
              X
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- TOTALES -->
      <div class="totales">
        <div>Subtotal: {{ subtotal.toFixed(2) }}</div>
        <div>IGV: {{ igv.toFixed(2) }}</div>
        <div class="total">TOTAL: {{ total.toFixed(2) }}</div>
      </div>

      <el-button
        type="success"
        size="large"
        class="mt"
        :loading="loading"
        @click="save"
      >
        Guardar Venta
      </el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";

import { getProductos } from "../services/productos";
import { getClientes } from "../services/clientes";
import { getDocumentos } from "../services/documentos";
import { createVenta } from "../services/ventas";

const documentos = ref([]);
const clientes = ref([]);
const productos = ref([]);

const productoSeleccionado = ref(null);
const cantidad = ref(1);

const loading = ref(false);

const form = ref({
  documento_id: null,
  cliente_id: null,
  fecha: new Date(),
  items: [],
});

/* 🔹 CALCULOS */
const subtotal = computed(() =>
  form.value.items.reduce((s, i) => s + i.subtotal, 0),
);

const igv = computed(() => subtotal.value * 0.18);

const total = computed(() => subtotal.value + igv.value);

/* 🔹 AGREGAR ITEM */
const addItem = () => {
  if (!productoSeleccionado.value) return;

  const p = productoSeleccionado.value;

  form.value.items.push({
    producto_id: p.id,
    descripcion: p.descripcion,
    cantidad: cantidad.value,
    precio: p.precio_venta,
    subtotal: cantidad.value * p.precio_venta,
  });

  productoSeleccionado.value = null;
  cantidad.value = 1;
};

/* 🔹 ELIMINAR ITEM */
const removeItem = (index) => form.value.items.splice(index, 1);

/* 🔹 GUARDAR */
const save = async () => {
  if (!form.value.items.length) {
    ElMessage.warning("Agregue productos");
    return;
  }

  loading.value = true;

  try {
    await createVenta({
      ...form.value,
      sucursal_id: 1, // 👈 o valor fijo temporal
      subtotal: subtotal.value,
      igv: igv.value,
      total: total.value,
    });

    ElMessage.success("Venta registrada");

    form.value.items = [];
  } catch (e) {
    ElMessage.error("Error al guardar");
  } finally {
    loading.value = false;
  }
};

/* 🔹 CARGAR */
onMounted(async () => {
  documentos.value = (await getDocumentos()).data;
  clientes.value = (await getClientes()).data.data;
  productos.value = (await getProductos()).data.data;
});
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.mt {
  margin-top: 14px;
}

.totales {
  margin-top: 20px;
  text-align: right;
  font-size: 15px;
}

.total {
  font-size: 18px;
  font-weight: bold;
  color: #16a34a;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
