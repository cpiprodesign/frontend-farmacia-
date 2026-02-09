<template>
    <div class="page">

        <!-- HEADER -->
        <div class="page-header">
            <h2 class="page-title">Categorías</h2>

            <el-button type="primary" @click="openModal">
                Nueva Categoría
            </el-button>
        </div>

        <!-- DESKTOP / TABLE -->
        <el-card v-if="!isMobile" shadow="hover" class="table-card">
            <el-table :data="categorias" border stripe v-loading="loadingTable">
                <el-table-column prop="nombre" label="Nombre" />
                <el-table-column prop="descripcion" label="Descripción" />

                <el-table-column label="Acciones" width="180" align="center">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="edit(row)">
                            Editar
                        </el-button>

                        <el-popconfirm title="¿Eliminar categoría?" @confirm="remove(row.id)">
                            <template #reference>
                                <el-button size="small" type="danger" plain>
                                    Eliminar
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- MOBILE / CARDS -->
        <div v-else class="mobile-list">
            <el-card v-for="item in categorias" :key="item.id" class="mobile-card" shadow="hover">
                <div class="mobile-title">{{ item.nombre }}</div>
                <div class="mobile-desc">
                    {{ item.descripcion || '—' }}
                </div>

                <div class="mobile-actions">
                    <el-button size="small" type="primary" plain @click="edit(item)">
                        Editar
                    </el-button>

                    <el-popconfirm title="¿Eliminar?" @confirm="remove(item.id)">
                        <template #reference>
                            <el-button size="small" type="danger" plain>
                                Eliminar
                            </el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </el-card>
        </div>

        <!-- MODAL -->
        <el-dialog v-model="modal" :title="form.id ? 'Editar Categoría' : 'Nueva Categoría'" width="420px"
            destroy-on-close>
            <el-form :model="form" label-position="top">
                <el-form-item label="Nombre">
                    <el-input v-model="form.nombre" placeholder="Ej: Pastillas" />
                </el-form-item>

                <el-form-item label="Descripción">
                    <el-input v-model="form.descripcion" placeholder="Opcional" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="modal = false">
                        Cancelar
                    </el-button>

                    <el-button type="primary" :loading="loadingSave" :disabled="loadingSave" @click="save">
                        Guardar
                    </el-button>
                </div>
            </template>
        </el-dialog>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useWindowSize } from '@vueuse/core'

import {
    getCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria
} from '@/services/categorias'

/* STATE */
const categorias = ref([])
const modal = ref(false)
const loadingTable = ref(false)
const loadingSave = ref(false)

const form = ref({
    id: null,
    nombre: '',
    descripcion: ''
})

/* RESPONSIVE */
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

/* METHODS */
const load = async () => {
    loadingTable.value = true
    try {
        const { data } = await getCategorias()
        categorias.value = data
    } finally {
        loadingTable.value = false
    }
}

const openModal = () => {
    form.value = { id: null, nombre: '', descripcion: '' }
    modal.value = true
}

const edit = (row) => {
    form.value = { ...row }
    modal.value = true
}

const save = async () => {
    if (loadingSave.value) return
    loadingSave.value = true

    try {
        if (form.value.id) {
            await updateCategoria(form.value.id, form.value)
            ElMessage.success('Categoría actualizada correctamente')
        } else {
            await createCategoria(form.value)
            ElMessage.success('Categoría guardada correctamente')
        }

        modal.value = false
        load()
    } catch (error) {
        if (error.response?.status === 422) {
            ElMessage.warning('La categoría ya existe')
        } else {
            ElMessage.error('Error al guardar la categoría')
        }
    } finally {
        loadingSave.value = false
    }
}

const remove = async (id) => {
    try {
        await deleteCategoria(id)
        ElMessage.success('Categoría eliminada')
        load()
    } catch {
        ElMessage.error('No se pudo eliminar')
    }
}

/* INIT */
onMounted(load)
</script>

<style scoped>
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
