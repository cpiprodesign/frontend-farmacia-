<template>
    <div class="page">

        <!-- HEADER -->
        <div class="header">
            <h2>Compras Realizadas</h2>

            <el-button type="primary" @click="$router.push('/compras/')">
                Nueva Compra
            </el-button>
        </div>

        <!-- TABLA -->
        <el-card>

            <el-table :data="compras.data" v-loading="loading" stripe border>

                <el-table-column prop="codigo" label="Código" width="140" />
                <el-table-column prop="fecha" label="Fecha" width="120" />

                <el-table-column label="Proveedor">
                    <template #default="{ row }">
                        {{ row.proveedor?.nombre }}
                    </template>
                </el-table-column>

                <el-table-column prop="total" label="Total" width="120" />

                <el-table-column label="Acciones" width="120">
                    <template #default="{ row }">
                        <el-button size="small" @click="ver(row.id)">
                            Ver
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!-- PAGINACION -->
            <div class="paginator">
                <el-pagination background layout="prev, pager, next" :total="compras.total"
                    :page-size="compras.per_page" @current-change="loadCompras" />
            </div>

        </el-card>

        <!-- MODAL DETALLE -->
        <el-dialog v-model="dialog" width="900px" title="Detalle Compra">

            <div class="info">

                <div><b>Código:</b> {{ compraDetalle.codigo }}</div>
                <div><b>Proveedor:</b> {{ compraDetalle.proveedor?.nombre }}</div>
                <div><b>Fecha:</b> {{ compraDetalle.fecha }}</div>
                <div><b>Total:</b> {{ compraDetalle.total }}</div>

            </div>

            <el-table :data="compraDetalle.detalles" border stripe>

                <el-table-column label="Producto">
                    <template #default="{ row }">
                        {{ row.producto?.descripcion }}
                    </template>
                </el-table-column>

                <el-table-column prop="cantidad" label="Cant" width="80" />
                <el-table-column prop="precio" label="Precio" width="100" />
                <el-table-column prop="subtotal" label="Subtotal" width="120" />
                <el-table-column prop="lote" label="Lote" width="120" />
                <el-table-column prop="fecha_vencimiento" label="Vence" width="120" />

            </el-table>

        </el-dialog>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getCompras, getCompra } from '../services/compras'

const compras = ref({ data: [] })
const loading = ref(false)

const dialog = ref(false)
const compraDetalle = ref({ detalles: [] })

/* CARGAR LISTADO */
const loadCompras = async (page = 1) => {
    loading.value = true
    try {
        const { data } = await getCompras({ page })
        compras.value = data
    } finally {
        loading.value = false
    }
}

/* VER DETALLE */
const ver = async (id) => {
    try {
        const { data } = await getCompra(id)
        compraDetalle.value = data
        dialog.value = true
    } catch {
        ElMessage.error('No se pudo cargar la compra')
    }
}

onMounted(() => loadCompras())
</script>

<style scoped>
.page {
    max-width: 1200px;
    margin: auto;
}

.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.paginator {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.info {
    margin-bottom: 15px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    font-size: 14px;
}

@media(max-width:768px) {
    .info {
        grid-template-columns: 1fr;
    }
}
</style>
