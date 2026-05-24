<template>
  <AppCard title="Pos venta..">
    <div class="pos">
      <!-- 🔎 BUSCADOR -->
      <el-card shadow="never" class="search-card">
        <!-- <el-input -->
        <!-- v-model="search" -->
        <!-- placeholder="Buscar producto por nombre o código" -->
        <!-- @keyup.enter="buscarProductos" -->
        <!-- clearable -->
        <!-- /> -->

        <el-select v-model="productoSeleccionado" filterable remote reserve-keyword placeholder="Buscar producto"
          :remote-method="buscarProductos1" :loading="loading" @change="seleccionarProducto" style="width: 100%">
          <el-option v-for="item in productos" :key="item.id" :label="item.descripcion + '-' + item.laboratorio.nombre"
            :value="item" />
        </el-select>
      </el-card>
      <div class="pos-body">
        <!-- 🛒 CARRITO -->
        <el-card class="cart">
          <div class="cart-header">🧾 Detalle de venta</div>
          <el-table :data="items" border>
            <el-table-column prop="descripcion" label="Producto" />
            <el-table-column label="Cant" width="180">
              <template #default="{ row }">
                <el-input-number v-model="row.cantidad" @change="calcular" :min="1" />
              </template>
            </el-table-column>
            <el-table-column prop="precio" label="Precio" width="100" />
            <el-table-column prop="subtotal" label="Subtotal" width="120" />
            <el-table-column width="60">
              <template #default="{ $index }">
                <el-button type="danger" size="small" @click="removeItem($index)">
                  ✕
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <!-- 💰 PANEL TOTALES -->
        <el-card class="totals">
          <div class="field">
            <label>Documento</label>
            <el-select v-model="form.documento_id">
              <el-option v-for="d in documentos" :key="d.id" :label="d.nombre" :value="d.id" />
            </el-select>
          </div>
          <div class="field">
            <label>Cliente</label>
            <el-select v-model="form.cliente_id" filterable>
              <el-option v-for="c in clientes" :key="c.id" :label="c.nombre" :value="c.id" />
            </el-select>
          </div>
          <div class="field">
            <label>Metodos de pago </label>
            <el-form-item >
  <el-select
    v-model="metodo_pago"
    placeholder="Seleccionar"
    style="width:100%"
  >
    <el-option
      label="💵 Efectivo"
      value="EFECTIVO"
    />

    <el-option
      label="📱 Yape"
      value="YAPE"
    />

    <el-option
      label="📲 Plin"
      value="PLIN"
    />

    <el-option
      label="💳 Tarjeta"
      value="TARJETA"
    />
  </el-select>
</el-form-item>
          </div>

          <div class="totals-box">
            <div>Subtotal: {{ base.toFixed(2) }}</div>
            <div>IGV: {{ igv.toFixed(2) }}</div>
            <div class="total">TOTAL: {{ total.toFixed(2) }}</div>
          </div>
          <el-button type="success" size="large" @click="guardar">
            💳 COBRAR
          </el-button>
          <!-- <el-button @click="verTicket">
  Vista previa ticket
</el-button> -->

<!-- <el-button type="success" @click="imprimir">
  Imprimir
</el-button> -->
        </el-card>
      </div>
      <!-- <el-dialog v-model="dialogTicket" width="300px" title="Ticket"> -->
      <!-- <div id="ticket"> -->
      <!-- <h3 style="text-align: center">Systfarma</h3> -->
      <!-- <p>Fecha: {{ ventaTicket?.fecha }}</p> -->
      <!-- <table style="width: 100%"> -->
      <!-- <tr v-for="d in ventaTicket?.detalles" :key="d.id"> -->
      <!-- <td>{{ d.productos?.descripcion }}</td> -->
      <!-- <td style="text-align: right">{{ d.cantidad }}</td> -->
      <!-- <td style="text-align: right">{{ d.subtotal }}</td> -->
      <!-- </tr> -->
      <!-- </table> -->
      <!-- <hr /> -->
      <!-- <h3 style="text-align: right">Total: {{ ventaTicket?.total }}</h3> -->
      <!-- </div> -->
      <!-- </el-dialog> -->
      <!-- vista previa -->
        <!-- <ticketPost v-if="ticket" :venta="ticket" /> -->
      <div class="ticket">
  <ticketPost v-if="ticket" :venta="ticket" />
</div>
    </div>
  </AppCard>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { nextTick } from "vue";
import AppCard from "@/components/AppCard.vue";
import { searchProductos } from "@/services/productos";
import { createVenta } from "@/services/ventas";
import { getDocumentos } from "@/services/documentos";
import { getClientes } from "@/services/clientes";
//import TicketVenta from "services/clientes";
import ticketPost from "../ventas/Ticket.vue";
const ticket = ref(null);
const search = ref("");
const productos = ref([]);
const items = ref([]);
const productoSeleccionado = ref(null);

const documentos = ref([]);
const clientes = ref([]);
const loading = ref(false);
const form = ref({
  documento_id: 1,
  cliente_id: null,
  fecha: new Date(),
  sucursal_id: 1,
   
});
const metodo_pago=ref('EFECTIVO');
const dialogTicket = ref(false);
const ventaTicket = ref(null);
//const ticket = ref(null);

//METODOS


const verTicket = () => {

  if(!ticket.value){
    ElMessage.warning("Primero registra una venta")
    return
  }

  window.print()

}
const imprimir = async (venta) => {
  ventaTicket.value = venta;
  dialogTicket.value = true;

  await nextTick();
  window.print();
};
const seleccionarProducto = (producto) => {
  if (producto) {
    agregarProducto(producto);
  }
};
const buscarProductos = async () => {
  try {
    const { data } = await searchProductos({ search: search.value });
    productos.value = data.data || [];

    if (productos.value.length > 0) {
      agregarProducto(productos.value[0]);
    } else {
      ElMessage.warning("Producto no encontrado");
    }
  } catch (error) {
    ElMessage.error("Error al buscar producto");
  }
};

const agregarProducto = (producto) => {
  const existe = items.value.find((i) => i.producto_id === producto.id);
  if (existe) {
    existe.cantidad++;
    calcular();
    return;
  }

  items.value.push({
    producto_id: producto.id,
    descripcion: producto.descripcion,
    cantidad: 1,
    precio: producto.precio_venta,
    subtotal: producto.precio_venta,
  });
  calcular();
};

const removeItem = (i) => {
  items.value.splice(i, 1);
  calcular();
};

const calcular = () => {
  items.value.forEach((i) => {
    i.subtotal = i.cantidad * i.precio;
  });
};

const subtotal = computed(() =>
  items.value.reduce((a, b) => a + Number(b.subtotal), 0),
);
const igv = computed(() => Number((total.value - base.value).toFixed(2)));
//const igv = computed(() => subtotal.value * 0.18);
//const total = computed(() => subtotal.value + igv.value);
const total = computed(() =>
  Number(
    items.value.reduce((acc, i) => acc + Number(i.subtotal), 0).toFixed(2),
  ),
);
const base = computed(() => Number((total.value / 1.18).toFixed(2)));

const guardar = async () => {
  // 🔹 Validar que haya productos
  if (!items.value.length) {
    ElMessage.warning("Agrega productos a la venta");
    return;
  }

  try {
    loading.value = true;

    // 🔹 GUARDAR VENTA
    const res = await createVenta({
      ...form.value,
      //sucursal_id: 1,
      sucursal_id: localStorage.getItem("sucursal_id"),
       apertura_id: localStorage.getItem("apertura_id"),
       metodo_pago: metodo_pago.value, // 👈 IMPORTANTE
      items: items.value,
      subtotal: base.value,
      igv: igv.value,
      total: total.value,
    });

    ElMessage.success("Venta registrada correctamente");

    // 🔹 IMPRIMIR TICKET
    // imprimir(res.data.data);
    ticket.value = res.data.data;
    //console.log(ticket.value);

    // 🔹 esperar render
    await nextTick();

    // 🔹 imprimir
    setTimeout(() => {
  window.print()
}, 300)

    // 🔹 LIMPIAR CARRITO
    items.value = [];
  } catch (error) {
    console.error("ERROR VENTA 👉", error);

    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Error al registrar venta";

    ElMessage.error(msg);
  } finally {
    loading.value = false;
  }
};
const buscarProductos1 = async (query) => {
  if (!query) {
    productos.value = [];
    return;
  }

  loading.value = true;

  try {
    const { data } = await searchProductos({ search: query });
    productos.value = data.data || [];
    console.log(productos.value);

    if (!productos.value.length) {
      ElMessage.warning("Producto no encontrado");
    }
  } catch (e) {
    ElMessage.error("Error al buscar producto");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  documentos.value = (await getDocumentos()).data;
  clientes.value = (await getClientes()).data.data;
  //console.log(clientes.value);
});
</script>
<style scoped>
.pos {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pos-body {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
}

.cart-header {
  font-weight: 600;
  margin-bottom: 10px;
}

.totals {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.totals-box {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 8px;
}

.total {
  font-size: 20px;
  font-weight: bold;
}

@media (max-width: 900px) {
  .pos-body {
    grid-template-columns: 1fr;
  }
}
</style>
