<template>

<div class="container">

<h2>Seleccionar Caja</h2>

<div class="grid">

<div
v-for="c in cajas"
:key="c.id"
class="card"
@click="seleccionar(c)"
>

<h3>{{ c.nombre }}</h3>

</div>

</div>

</div>

</template>

<script setup>

import { ref,onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

const cajas = ref([])

onMounted(async ()=>{

const token = localStorage.getItem("token")
const sucursal = localStorage.getItem("sucursal_id")

const res = await axios.get(
"https://api-farmacia.test/api/cajas/"+sucursal,
{
headers:{
Authorization:"Bearer "+token
}
})

cajas.value = res.data

})

const seleccionar = (c)=>{

localStorage.setItem("caja_id",c.id)

router.push("/apertura-caja")

}

</script>

<style>

.container{
padding:40px;
}

.grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:20px;
}

.card{
padding:30px;
border-radius:10px;
background:#f4f4f4;
cursor:pointer;
text-align:center;
}

.card:hover{
background:#2563eb;
color:white;
}

</style>