<template>
  <AppCard title="Listado de productos">
    <!-- <template #actions> -->
    <!-- <el-button type="primary" size="small"> -->
    <!-- Nuevo -->
    <!-- </el-button> -->
    <!-- </template> -->

    <!-- <el-table :data="productos.data" stripe> -->

    <!-- </el-table> -->
    <div class="page">
      <!-- HEADER -->
      <div class="page-header">
        <div class="actions">
          <el-input
            v-model="search"
            placeholder="Buscar producto..."
            clearable
            class="search"
            @keyup.enter="loadProductos"
          />
          <el-button type="primary" @click="openNew">
            Nuevo Producto
          </el-button>
        </div>
      </div>
      <!-- CARD -->

      <!-- HEADER CARD -->

      <!-- TABLA -->
      <el-table :data="productos.data" v-loading="loading" stripe border>
        <el-table-column prop="codigo_barra" label="Código" width="140" />
        <el-table-column prop="descripcion" label="Producto" />
        <el-table-column label="Categoría">
          <template #default="{ row }">
            {{ row.categoria?.nombre }}
          </template>
        </el-table-column>
        <el-table-column prop="precio_venta" label="Precio" width="120" />
        <el-table-column label="Stock" width="140">
          <template #default="{ row }">
            <el-button size="small" type="success" @click="verStock(row)">
              Ver stock
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Acciones" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="edit(row)">Editar</el-button>
            <el-popconfirm
              title="¿Eliminar producto?"
              @confirm="remove(row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger"> Eliminar </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- PAGINADOR -->
      <div class="paginator">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="productos.total"
          :page-size="productos.per_page"
          :current-page="page"
          @current-change="changePage"
        />
      </div>

      <!-- ================= MODAL PRODUCTO ================= -->

      <el-dialog v-model="dialog" title="Producto" width="850px">
        <el-tabs v-model="tab">
          <!-- GENERAL -->
          <el-tab-pane label="General" name="general">
            <div class="form-grid">
              <el-form-item label="Código Barra">
                <el-input v-model="form.codigo_barra" />
              </el-form-item>

              <el-form-item label="Categoría">
                <el-select v-model="form.categoria_id" clearable>
                  <el-option
                    v-for="c in categorias"
                    :key="c.id"
                    :label="c.nombre"
                    :value="c.id"
                  />
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="Descripción">
              <el-input v-model="form.descripcion" />
            </el-form-item>

            <div class="form-grid">
              <el-form-item label="Laboratorio">
                <el-select v-model="form.laboratorio_id" clearable>
                  <el-option
                    v-for="l in laboratorios"
                    :key="l.id"
                    :label="l.nombre"
                    :value="l.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="Presentación">
                <el-select v-model="form.presentacion_id" clearable>
                  <el-option
                    v-for="p in presentaciones"
                    :key="p.id"
                    :label="p.nombre"
                    :value="p.id"
                  />
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="Proveedor">
              <el-select v-model="form.proveedor_id" clearable>
                <el-option
                  v-for="p in proveedores"
                  :key="p.id"
                  :label="p.nombre"
                  :value="p.id"
                />
              </el-select>
            </el-form-item>
          </el-tab-pane>

          <!-- PRECIOS -->
          <el-tab-pane label="Precios" name="precios">
            <div class="form-grid">
              <el-form-item label="Precio Compra">
                <el-input-number v-model="form.precio_compra" :min="0" />
              </el-form-item>

              <el-form-item label="Precio Venta">
                <el-input-number v-model="form.precio_venta" :min="0" />
              </el-form-item>
            </div>

            <el-form-item label="Descuento">
              <el-input-number v-model="form.descuento" :min="0" />
            </el-form-item>

            <div class="form-grid">
              <el-form-item label="Aplica Tienda">
                <el-switch v-model="form.aplica_tienda" />
              </el-form-item>

              <el-form-item label="IGV Incluido">
                <el-switch v-model="form.igv_incluido" />
              </el-form-item>
            </div>
          </el-tab-pane>

          <!-- FARMACIA -->
          <el-tab-pane label="Farmacia" name="farmacia">
            <el-form-item label="Uso Terapéutico">
              <el-input v-model="form.uso_terapeutico" />
            </el-form-item>

            <el-form-item label="Sustancia Activa">
              <el-input v-model="form.sustancia_activa" />
            </el-form-item>

            <el-form-item label="Código DIGEMID">
              <el-input v-model="form.codigo_digemid" />
            </el-form-item>
          </el-tab-pane>

          <!-- EMPAQUE -->
          <el-tab-pane v-if="mostrarEmpaque" label="Empaque" name="empaque">
            <div class="form-grid">
              <el-form-item label="Precio Blister">
                <el-input-number v-model="form.precio_blister" />
              </el-form-item>

              <el-form-item label="Precio Caja">
                <el-input-number v-model="form.precio_caja" />
              </el-form-item>
            </div>

            <div class="form-grid">
              <el-form-item label="Unidades Blister">
                <el-input-number v-model="form.unidades_blister" />
              </el-form-item>

              <el-form-item label="Unidades Caja">
                <el-input-number v-model="form.unidades_caja" />
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>

        <template #footer>
          <el-button @click="dialog = false">Cancelar</el-button>
          <el-button type="primary" :loading="loadingSave" @click="save">
            Guardar
          </el-button>
        </template>
      </el-dialog>

      <!-- ================= MODAL STOCK ================= -->
      <el-dialog v-model="dialogStock" title="Stock del Producto" width="700px">
        <el-table :data="stockList" stripe border>
          <el-table-column prop="sucursal.nombre" label="Sucursal" />
          <el-table-column prop="lote" label="Lote" width="120" />
          <el-table-column
            prop="fecha_vencimiento"
            label="Vencimiento"
            width="140"
          />
          <el-table-column prop="cantidad" label="Stock" width="100" />
        </el-table>
      </el-dialog>
    </div>
  </AppCard>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { getStockProducto } from "../services/stocks";
import AppCard from "@/components/AppCard.vue";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/productos";

import { getCategorias } from "../services/categorias";
import { getLaboratorios } from "../services/laboratorios";
import { getProveedores } from "../services/proveedores";
import { getPresentaciones } from "../services/presentaciones";

const dialogStock = ref(false);
const stockList = ref([]);
const productos = ref({ data: [] });

const categorias = ref([]);
const laboratorios = ref([]);
const proveedores = ref([]);
const presentaciones = ref([]);

const loading = ref(false);
const loadingSave = ref(false);

const page = ref(1);
const search = ref("");
const dialog = ref(false);
const tab = ref("general");

const form = ref({
  id: null,
  codigo_barra: "",
  descripcion: "",
  uso_terapeutico: "",
  sustancia_activa: "",
  codigo_digemid: "",
  categoria_id: null,
  laboratorio_id: null,
  proveedor_id: null,
  presentacion_id: null,
  precio_compra: 0,
  precio_venta: 0,
  precio_blister: 0,
  precio_caja: 0,
  descuento: 0,
  unidades_blister: 0,
  unidades_caja: 0,
  aplica_tienda: false,
  igv_incluido: true,
});
const verStock = async (producto) => {
  const { data } = await getStockProducto(producto.id);
  stockList.value = data;
  dialogStock.value = true;
  console.log(stockList.value);
};

const mostrarEmpaque = computed(() => {
  if (!form.value.presentacion_id) return false;
  if (!presentaciones.value.length) return false;

  const p = presentaciones.value.find(
    (x) => String(x.id) === String(form.value.presentacion_id),
  );

  if (!p) return false;

  return Number(p.tiene_empaque) === 1;
});

watch(mostrarEmpaque, (val) => {
  if (!val) {
    form.value.precio_blister = 0;
    form.value.precio_caja = 0;
    form.value.unidades_blister = 0;
    form.value.unidades_caja = 0;
  }
});

const loadProductos = async () => {
  loading.value = true;
  try {
    const { data } = await getProductos({
      page: page.value,
      search: search.value,
    });
    productos.value = data;
  } finally {
    loading.value = false;
  }
};

const loadCatalogos = async () => {
  categorias.value = (await getCategorias()).data;
  laboratorios.value = (await getLaboratorios()).data;
  const resp = await getProveedores();
  //proveedores.value = p.data.data || prov.data

  proveedores.value = (await getProveedores()).data.data;
  // const resp = await getProveedores()
  //console.log(resp.data)
  //console.log(proveedores.value)
  presentaciones.value = (await getPresentaciones()).data;
  console.log(proveedores.value);
};

const changePage = (p) => {
  page.value = p;
  loadProductos();
};

const openNew = () => {
  form.value = {
    id: null,
    codigo_barra: "",
    descripcion: "",
    uso_terapeutico: "",
    sustancia_activa: "",
    codigo_digemid: "",
    categoria_id: null,
    laboratorio_id: null,
    proveedor_id: null,
    presentacion_id: null,
    precio_compra: 0,
    precio_venta: 0,
    precio_blister: 0,
    precio_caja: 0,
    descuento: 0,
    unidades_blister: 0,
    unidades_caja: 0,
    aplica_tienda: false,
    igv_incluido: true,
  };
  tab.value = "general";
  dialog.value = true;
};

const edit = (row) => {
  form.value = { ...row };
  dialog.value = true;
};

const save = async () => {
  if (!form.value.descripcion) {
    ElMessage.error("Ingrese descripción");
    return;
  }

  loadingSave.value = true;

  try {
    if (form.value.id) {
      await updateProducto(form.value.id, form.value);
      ElMessage.success("Producto actualizado");
    } else {
      await createProducto(form.value);
      ElMessage.success("Producto creado");
    }

    dialog.value = false;
    loadProductos();
  } catch {
    ElMessage.error("Error al guardar");
  } finally {
    loadingSave.value = false;
  }
};

const remove = async (id) => {
  await deleteProducto(id);
  ElMessage.success("Producto eliminado");
  loadProductos();
};

onMounted(() => {
  loadProductos();
  loadCatalogos();
});
</script>
<style scoped>
.page {
  max-width: 1300px;
  margin: auto;
}

.title {
  margin: 0;
}

.subtitle {
  font-size: 12px;
  color: #6b7280;
}

/* HEADER */
.page-header {
  display: flex;
  justify-content: space-between; /* 👈 separa título y acciones */
  align-items: center;
  margin-bottom: 18px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-left: auto; /* 👈 empuja a la derecha */
}

.search-input {
  width: 220px;
}

/* CARD */
.card-table {
  border-radius: 12px;
  overflow: hidden;
}

.el-card__header {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-weight: 600;
  padding: 14px 18px;
}

.card-header {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-weight: 600;
  padding: 14px 18px;
}

/* PAGINADOR */
.paginator {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* FORM */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* 📱 móvil */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .actions {
    width: 100%;
    justify-content: space-between;
  }

  .search-input {
    flex: 1;
  }
}
</style>
