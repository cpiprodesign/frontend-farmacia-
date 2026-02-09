<template>
    <div class="grid">
        <el-card class="stat">
            <div class="title">Ventas Hoy</div>
            <div class="value">S/ 2,450</div>
        </el-card>

        <el-card class="stat">
            <div class="title">Productos</div>
            <div class="value">324</div>
        </el-card>

        <el-card class="stat">
            <div class="title">Stock Crítico</div>
            <div class="value danger">12</div>
        </el-card>
    </div>
</template>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
}

.stat {
    padding: 24px;
}

.title {
    color: var(--muted);
    font-size: 14px;
}

.value {
    font-size: 28px;
    font-weight: 600;
    margin-top: 8px;
}

.value.danger {
    color: #ef4444;
}
</style>
