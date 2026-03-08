<template>
    <el-card class="app-card" shadow="never">

        <!-- HEADER -->
        <template v-if="title || $slots.header" #header>
            <div class="card-header">
                <slot name="header">
                    {{ title }}
                </slot>

                <div v-if="$slots.actions" class="card-actions">
                    <slot name="actions" />
                </div>
            </div>
        </template>

        <!-- BODY -->
        <div class="card-body">
            <slot/>
        </div>

    </el-card>
</template>

<script setup>
defineProps({
    title: String
})
</script>

<style scoped>
.app-card :deep(.el-card__header) {
    padding: 0;
    border-bottom: none;
}

.card-header {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    padding: 14px 18px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-body {
    padding: 18px;
}
</style>
