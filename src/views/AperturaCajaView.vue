<template>

<div class="container">

  <el-card class="box-card">

    <template #header>
      <span>Apertura de Caja</span>
    </template>

    <el-form label-position="top">

      <el-form-item label="Monto inicial">

        <el-input
          v-model="monto"
          placeholder="Ingrese monto"
          type="number"
          size="large"
        />

      </el-form-item>

      <el-form-item>

        <el-button
          type="primary"
          size="large"
          style="width:100%"
          @click="abrirCaja"
        >
          Abrir Caja
        </el-button>

      </el-form-item>

    </el-form>

  </el-card>

</div>

</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"

const router = useRouter()
const monto = ref(0)

const abrirCaja = async () => {

  try {

    const token = localStorage.getItem("token")
    const caja = localStorage.getItem("caja_id")

    const res = await axios.post(
      "https://api-farmacia.test/api/abrir-caja",
      {
        caja_id: caja,
        monto_inicial: monto.value
      },
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )

    // 👉 SIEMPRE GUARDAMOS LA APERTURA
    localStorage.setItem("apertura_id", res.data.data.id)

    ElMessage.success(res.data.message)

    // 👉 SIEMPRE REDIRIGE AL POS
    router.push("/ventas")

  } catch (error) {

    ElMessage.error("Error al abrir caja")

  }

}
</script>

<style scoped>

.container{
  display:flex;
  justify-content:center;
  align-items:center;
  height:80vh;
}

.box-card{
  width:400px;
}

</style>