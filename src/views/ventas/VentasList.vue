<template>

    <div class="page">

        <el-card shadow="hover">

            <template #header>
                <h3>Listado de ventas</h3>
            </template>

            <!-- FILTROS -->

            <div class="filters-grid">

                <el-select v-model="filters.documento_id" placeholder="Documento" clearable>
                    <el-option v-for="d in documentos" :key="d.id" :label="d.nombre" :value="d.id" />
                </el-select>

                <el-select v-model="filters.cliente_id" placeholder="Cliente" clearable>
                    <el-option v-for="c in clientes" :key="c.id" :label="c.nombre" :value="c.id" />
                </el-select>

                <el-input v-model="filters.numero" placeholder="Número" />

                <el-date-picker v-model="filters.fechas" type="daterange" range-separator="a" start-placeholder="Inicio"
                    end-placeholder="Fin" />

                <el-button type="primary" @click="loadVentas" class="btn-buscar">
                    Buscar
                </el-button>

            </div>

            <!-- TABLA -->

            <el-table :data="ventas.data" border stripe v-loading="loading">

                <el-table-column label="Opciones" width="120">

                    <template #default="{ row }">

                        <el-dropdown>

                            <el-button type="primary" size="small">
                                Opciones
                            </el-button>

                            <template #dropdown>

                                <el-dropdown-menu>

                                    <el-dropdown-item @click="verdetalle(row)">
                                        Ver detalle
                                    </el-dropdown-item>

                                    <el-dropdown-item @click="imprimirTicket(row)">
                                        Imprimir ticket
                                    </el-dropdown-item>

                                </el-dropdown-menu>

                            </template>

                        </el-dropdown>

                    </template>

                </el-table-column>

                <el-table-column prop="user.name" label="Usuario" />

                <el-table-column label="Cliente">

                    <template #default="{ row }">
                        {{ row.cliente?.nombre }}
                    </template>

                </el-table-column>

                <el-table-column label="Comprobante">

                    <template #default="{ row }">
                        {{ row.documento?.nombre }}
                    </template>

                </el-table-column>

                <el-table-column prop="serie" label="Serie" />

                <el-table-column prop="numero" label="Número" />

                <el-table-column prop="fecha" label="Fecha" />

                <el-table-column prop="total" label="Total" />

                <el-table-column label="Estado">

                    <template #default="{ row }">

                        <el-tag type="success" v-if="row.estado == 'REGISTRADO'">
                            {{ row.estado }}
                        </el-tag>

                    </template>

                </el-table-column>

            </el-table>

            <!-- PAGINACION -->

            <div class="paginator">

                <el-pagination background layout="prev, pager, next" :total="ventas.total" :page-size="ventas.per_page"
                    @current-change="changePage" />

            </div>

        </el-card>

    </div>
    <!-- aqui el modal del detalles -->
    <el-dialog v-model="modalDetalle" title="Detalle de venta" width="700px">

        <div v-if="ventaSeleccionada">

            <p><b>Documento:</b> {{ ventaSeleccionada.documento?.nombre }}</p>
            <p><b>Cliente:</b> {{ ventaSeleccionada.cliente?.nombre }}</p>
            <p><b>Serie:</b> {{ ventaSeleccionada.serie }}</p>
            <p><b>Número:</b> {{ ventaSeleccionada.numero }}</p>
            <p><b>Fecha:</b> {{ ventaSeleccionada.fecha }}</p>

            <el-table :data="ventaSeleccionada.detalles" border stripe style="margin-top:10px">

                <el-table-column prop="producto.descripcion" label="Producto" />

                <el-table-column prop="cantidad" label="Cantidad" width="100" />

                <el-table-column prop="precio" label="Precio" width="120" />

                <el-table-column prop="subtotal" label="Subtotal" width="120" />

            </el-table>

            <div style="margin-top:15px;text-align:right">

                <p><b>Subtotal:</b> {{ ventaSeleccionada.subtotal }}</p>
                <p><b>IGV:</b> {{ ventaSeleccionada.igv }}</p>
                <h3>Total: {{ ventaSeleccionada.total }}</h3>

            </div>

        </div>

    </el-dialog>
 <Ticket :venta="ventaTicket"
 @qr-ready="printTicket" />
 
    <!-- <div style="display:none">

        <Ticket :venta="ventaTicket" />

    </div> -->

</template>

<script setup>

import { ref, onMounted } from "vue"
import { nextTick } from "vue"
import { getVentas } from "@/services/ventas"
import { getClientes } from "@/services/clientes"
import { getDocumentos } from "@/services/documentos"
import { getVenta } from "@/services/ventas"
import Ticket from "@/views/ventas/Ticket.vue"
//detalles propiedad 
const ventaTicket = ref(null)
const ticketRef = ref(null)
const modalDetalle = ref(false)
const printing = ref(false)
const ventaSeleccionada = ref(null)
//const ventaTicket = ref(null)
const ventas = ref({ data: [] })
const loading = ref(false)
const printed = ref(false)
const clientes = ref([])
const documentos = ref([])

const page = ref(1)

const filters = ref({
    documento_id: "",
    cliente_id: "",
    numero: "",
    fechas: []
})
// metodos 
//const printed = ref(false)

const printTicket = () => {

  if(printed.value) return

  printed.value = true

  window.print()

  setTimeout(()=>{
    printed.value = false
  },1000)

}

const imprimirTicket = async (venta) => {

    loading.value = true

   if(printing.value) return

printing.value = true

const {data} = await getVenta(venta.id)

ventaTicket.value = data

await nextTick()

setTimeout(()=>{
  window.print()
  printing.value = false
},300)
    

    loading.value = false

}
const verdetalle = async (venta) => {

    ventaSeleccionada.value = venta

    modalDetalle.value = true

}

const loadVentas = async () => {

    loading.value = true

    const params = {
        page: page.value,
        documento_id: filters.value.documento_id,
        cliente_id: filters.value.cliente_id,
        numero: filters.value.numero
    }

    if (filters.value.fechas?.length) {
        params.fecha_inicio = filters.value.fechas[0]
        params.fecha_fin = filters.value.fechas[1]
    }

    const { data } = await getVentas(params)

    ventas.value = data

    loading.value = false

}

const changePage = (p) => {
    page.value = p
    loadVentas()
}

const ver = (venta) => {
    console.log("ver venta", venta)
}

const imprimir = (venta) => {
    console.log("imprimir ticket", venta)
}

onMounted(async () => {

    loadVentas()

    const c = await getClientes()
    clientes.value = c.data.data

    const d = await getDocumentos()
    documentos.value = d.data

})

</script>

<style>
.page {
    max-width: 1300px;
    margin: auto;
}

/* GRID FILTROS */

.filters-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr) auto;
    gap: 12px;
    margin-bottom: 20px;
    align-items: center;
}

.btn-buscar {
    height: 40px;
}

/* TABLET */

@media (max-width:1024px) {

    .filters-grid {
        grid-template-columns: repeat(2, 1fr);
    }

}

/* MOVIL */

@media (max-width:600px) {

    .filters-grid {
        grid-template-columns: 1fr;
    }

    .btn-buscar {
        width: 100%;
    }

}

/* PAGINACION */

.paginator {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
</style>