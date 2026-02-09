<template>
    <div class="page">

        <!-- HEADER -->
        <div class="page-header">
            <h2>Clientes</h2>

            <div class="actions">
                <el-input v-model="search" placeholder="Buscar cliente..." clearable @keyup.enter="loadClientes" />

                <el-button type="primary" @click="openNew">
                    Nuevo Cliente
                </el-button>
            </div>
        </div>

        <!-- TABLA -->
        <el-card shadow="hover">

            <el-table :data="clientes.data" v-loading="loading" stripe border>

                <el-table-column label="Tipo Doc" width="130">
                    <template #default="{ row }">
                        {{ row.tipo_documento?.descripcion }}
                    </template>
                </el-table-column>

                <el-table-column prop="numero_documento" label="Número" width="150" />
                <el-table-column prop="nombre" label="Nombre" />
                <el-table-column prop="direccion" label="Dirección" />
                <el-table-column prop="telefono" label="Teléfono" width="140" />
                <el-table-column prop="email" label="Correo" />

                <el-table-column label="Acciones" width="160">
                    <template #default="{ row }">
                        <el-button size="small" @click="edit(row)">
                            Editar
                        </el-button>

                        <el-popconfirm title="¿Eliminar cliente?" @confirm="remove(row.id)">
                            <template #reference>
                                <el-button size="small" type="danger">
                                    Eliminar
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>

            </el-table>

            <!-- PAGINACION -->
            <div class="paginator">
                <el-pagination background layout="prev, pager, next" :total="clientes.total"
                    :page-size="clientes.per_page" :current-page="page" @current-change="changePage" />
            </div>

        </el-card>

        <!-- MODAL -->
        <el-dialog v-model="dialog" title="Cliente" width="600px">

            <el-form :model="form" label-position="top">

                <div class="form-grid">

                    <el-form-item label="Tipo Documento">
                        <el-select v-model="form.tipo_documento_id" clearable>
                            <el-option v-for="item in tiposDocumento" :key="item.id" :label="item.descripcion"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="Número Documento">
                        <el-input v-model="form.numero_documento" />
                    </el-form-item>

                </div>

                <el-form-item label="Nombre / Razón Social">
                    <el-input v-model="form.nombre" />
                </el-form-item>

                <el-form-item label="Dirección">
                    <el-input type="textarea" :rows="2" v-model="form.direccion" />
                </el-form-item>

                <div class="form-grid">

                    <el-form-item label="Teléfono">
                        <el-input v-model="form.telefono" />
                    </el-form-item>

                    <el-form-item label="Correo">
                        <el-input v-model="form.email" />
                    </el-form-item>

                </div>

            </el-form>

            <template #footer>
                <el-button @click="dialog = false">
                    Cancelar
                </el-button>

                <el-button type="primary" :loading="loadingSave" @click="save">
                    Guardar
                </el-button>
            </template>

        </el-dialog>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

import {
    getClientes,
    createCliente,
    updateCliente,
    deleteCliente
} from '../services/clientes'

import { getTiposDocumento } from '../services/tiposDocumento'

/* STATE */

const clientes = ref({ data: [] })
const tiposDocumento = ref([])

const loading = ref(false)
const loadingSave = ref(false)

const page = ref(1)
const search = ref('')

const dialog = ref(false)

const form = ref({
    id: null,
    tipo_documento_id: '',
    numero_documento: '',
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
})

/* LOAD CLIENTES */

const loadClientes = async () => {
    loading.value = true

    try {
        const { data } = await getClientes({
            page: page.value,
            search: search.value
        })

        clientes.value = data

    } finally {
        loading.value = false
    }
}

/* LOAD TIPOS DOC */

const loadTiposDocumento = async () => {
    const { data } = await getTiposDocumento()
    tiposDocumento.value = data
}

/* PAGINACION */

const changePage = (p) => {
    page.value = p
    loadClientes()
}

/* MODAL */

const openNew = () => {
    form.value = {
        id: null,
        tipo_documento_id: '',
        numero_documento: '',
        nombre: '',
        direccion: '',
        telefono: '',
        email: ''
    }

    dialog.value = true
}

const edit = (row) => {
    form.value = { ...row }
    dialog.value = true
}

/* SAVE */

const save = async () => {

    if (!form.value.nombre) {
        ElMessage.error('Ingrese nombre')
        return
    }

    loadingSave.value = true

    try {

        if (form.value.id) {
            await updateCliente(form.value.id, form.value)
            ElMessage.success('Cliente actualizado')
        } else {
            await createCliente(form.value)
            ElMessage.success('Cliente creado')
        }

        dialog.value = false
        loadClientes()

    } catch {
        ElMessage.error('Error al guardar')
    } finally {
        loadingSave.value = false
    }
}

/* DELETE */

const remove = async (id) => {
    await deleteCliente(id)
    ElMessage.success('Cliente eliminado')
    loadClientes()
}

/* INIT */

onMounted(() => {
    loadClientes()
    loadTiposDocumento()
})
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
    margin-bottom: 20px;
}

.actions {
    display: flex;
    gap: 10px;
}

.paginator {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

/* FORM GRID PRO */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

@media(max-width:768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>
