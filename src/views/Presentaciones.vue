<template>
    <div class="page">

        <div class="page-header">
            <h2 class="page-title">Presentaciones</h2>
            <el-button type="primary" @click="openModal">
                Nueva Presentación
            </el-button>
        </div>

        <el-card shadow="hover">
            <el-table :data="presentaciones" border stripe>
                <el-table-column prop="nombre" label="Nombre" />

                <el-table-column label="Acciones" width="180" align="center">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="edit(row)">
                            Editar
                        </el-button>

                        <el-popconfirm title="¿Eliminar presentación?" @confirm="remove(row.id)">
                            <template #reference>
                                <el-button size="small" type="danger">
                                    Eliminar
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="modal" :title="form.id ? 'Editar Presentación' : 'Nueva Presentación'" width="400px"
            destroy-on-close>
            <el-form :model="form" label-position="top">
                <el-form-item label="Nombre">
                    <el-input v-model="form.nombre" placeholder="Ej: Tableta" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="modal = false">Cancelar</el-button>
                <el-button type="primary" :loading="loading" @click="save">
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
    getPresentaciones,
    createPresentacion,
    updatePresentacion,
    deletePresentacion
} from '../services/presentaciones'

const presentaciones = ref([])
const modal = ref(false)
const loading = ref(false)

const form = ref({
    id: null,
    nombre: ''
})

const load = async () => {
    const { data } = await getPresentaciones()
    presentaciones.value = data
}

const openModal = () => {
    form.value = { id: null, nombre: '' }
    modal.value = true
}

const edit = (row) => {
    form.value = { ...row }
    modal.value = true
}

const save = async () => {
    if (loading.value) return
    loading.value = true

    try {
        if (form.value.id) {
            await updatePresentacion(form.value.id, form.value)
            ElMessage.success('Presentación actualizada')
        } else {
            await createPresentacion(form.value)
            ElMessage.success('Presentación creada')
        }
        modal.value = false
        load()
    } catch {
        ElMessage.error('Error al guardar')
    } finally {
        loading.value = false
    }
}

const remove = async (id) => {
    await deletePresentacion(id)
    ElMessage.success('Presentación eliminada')
    load()
}

onMounted(load)
</script>
<style>
.page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
}


.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}


.page-title {
    font-size: 20px;
    font-weight: 600;
}


/* TABLE */
.table-card {
    border-radius: 16px;
}


/* MOBILE */
.mobile-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}


.mobile-card {
    border-radius: 14px;
}


.mobile-title {
    font-weight: 600;
    font-size: 15px;
}


.mobile-desc {
    color: #6b7280;
    margin: 6px 0 12px;
}


.mobile-actions {
    display: flex;
    gap: 8px;
}


/* DIALOG */
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}


@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
