<template>
  <div v-if="venta" class="ticket" id="ticket">
    <div class="ticket">

      <!-- LOGO -->
      <div class="center">
        <!-- <img src="./logo.png" class="logo" /> -->
        <img :src="logo" class="logo" />
      </div>

      <!-- EMPRESA -->
      <div class="center">
        <b>Systfarma</b>
        <p>RUC: 20123456789</p>
        <p>Av. Siempre Viva 123</p>
      </div>

      <div class="divider"></div>

      <!-- DOCUMENTO -->
      <div class="center bold">
        {{ venta.documento.nombre }}
        <br />
        {{ venta.serie }}-{{ venta.numero }}
      </div>

      <div class="divider"></div>

      <!-- INFO -->
      <p>Fecha: {{ venta.fecha }}</p>
      <p>Cliente: {{ venta.cliente?.nombre }}</p>

      <div class="divider"></div>

      <!-- PRODUCTOS -->
      <div v-for="d in venta.detalles" :key="d.id">

        <div class="producto">
          {{ d.producto.descripcion }}
        </div>

        <div class="fila">
          <span>{{ d.cantidad }} x {{ money(d.precio) }}</span>
          <span>{{ money(d.subtotal) }}</span>
        </div>

      </div>

      <div class="divider"></div>

      <!-- TOTALES -->
      <div class="fila">
        <span>Subtotal</span>
        <span>{{ money(venta.subtotal) }}</span>
      </div>

      <div class="fila">
        <span>IGV</span>
        <span>{{ money(venta.igv) }}</span>
      </div>

      <div class="fila total">
        <span>TOTAL</span>
        <span>{{ money(venta.total) }}</span>
      </div>

      <div class="divider"></div>

      <!-- QR -->
      <div class="center">
        <!-- <canvas ref="qrCanvas"></canvas> -->
       <div class="qr">

<canvas
ref="qrCanvas"
v-show="qrReady"
></canvas>

</div>
      </div>

      <!-- CODIGO BARRAS -->
      <div class="center barcode">
        *{{ venta.serie }}{{ venta.numero }}*
      </div>

      <div class="center">
        Gracias por su compra 🙌
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import logo from '@/assets/logos/logo.png'
import QRCode from "qrcode"
import { watch } from "vue"
const props = defineProps({
  venta: Object
})

const qrCanvas = ref(null)
const qrReady = ref(false)
const money = (v) => {
  return "S/ " + Number(v).toFixed(2)
}
//
const emit = defineEmits(["qr-ready"])
//
watch(
  () => props.venta,
  (venta) => {

    if (!venta) return

    const dataQR = [
      venta.documento?.numero,
      "20123456789",
      venta.serie,
      venta.numero,
      venta.total
    ].join("|")

    qrReady.value = false

    QRCode.toCanvas(qrCanvas.value, dataQR, { width: 90 }, () => {

      qrReady.value = true

      emit("ready")

    })

  },
  { immediate: true }
)
</script>

<style scoped>
.ticket {
  width: 80mm;
  font-family: monospace;
  font-size: 12px;
  margin: 0 auto;
}

.logo {
  width: 120px;
  display: block;
  margin: 0 auto;
}

.center {
  text-align: center;
}

.bold {
  font-weight: bold;
}

.divider {
  border-top: 1px dashed #000;
  margin: 6px 0;
}

.producto {
  font-weight: bold;
}

.fila {
  display: flex;
  justify-content: space-between;
}

.total {
  font-size: 14px;
  font-weight: bold;
}

.barcode {
  font-size: 20px;
  letter-spacing: 3px;
  margin-top: 10px;
}
</style>