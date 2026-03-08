<template>
  <div id="ticket" class="ticket">
    <!-- EMPRESA -->
    <div class="center">
      <div class="empresa">Systfarma</div>
      <div class="ruc">RUC: 20123456789</div>
      <div class="dir">Av. Siempre Viva 123</div>
      <div class="line"></div>
    </div>

    <!-- DOCUMENTO -->
    <div class="center">
      <div class="doc">{{ venta.documento.nombre }}</div>
      <div class="serie">{{ venta.serie }}-{{ venta.numero }}</div>
      <div class="line"></div>
    </div>

    <!-- INFO -->
    <div class="info">
      <div>Fecha: {{ venta.fecha }}</div>
      <div>Cliente: {{ venta.cliente?.nombre }}</div>
      <div>Cajero: {{ venta.usuario }}</div>
    </div>

    <div class="line"></div>

    <!-- ITEMS -->
    <div v-for="item in venta.detalles" :key="item.id" class="item">
      <div class="nombre">{{ item.producto.descripcion }}</div>
      <div class="detalle">
        {{ item.cantidad }} x {{ money(item.precio) }}
        <span>{{ money(item.subtotal) }}</span>
      </div>
    </div>

    <div class="line"></div>

    <!-- TOTALES -->
    <div class="totales">
      <div>
        Subtotal <span>{{ money(venta.subtotal) }}</span>
      </div>
      <div>
        IGV <span>{{ money(venta.igv) }}</span>
      </div>
      <div class="total">
        TOTAL <span>{{ money(venta.total) }}</span>
      </div>
    </div>

    <div class="line"></div>

    <!-- MENSAJE -->
    <div class="center mensaje">Gracias por su compra 🙌</div>

    <!-- ESPACIO CORTE -->
    <div class="corte"></div>
  </div>
</template>
<script setup>
const props = defineProps({
  venta: Object,
});

const money = (v) => `S/ ${Number(v).toFixed(2)}`;
</script>
