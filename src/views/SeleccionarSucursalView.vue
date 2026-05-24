<template>

<div class="container">

<h2>Seleccionar sucursal</h2>

<div class="grid">

<div
v-for="s in sucursales"
:key="s.id"
class="card"
@click="seleccionar(s)"
>

<h3>{{ s.nombre }}</h3>

</div>

</div>

</div>

</template>

<script setup>

import { ref, onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

const sucursales = ref([])

onMounted(async ()=>{

const token = localStorage.getItem("token")

const res = await axios.get(
"https://api-farmacia.test/api/sucursales",
{
headers:{
Authorization: "Bearer "+token
}
})

sucursales.value = res.data

})

const seleccionar = (s) => {

localStorage.setItem("sucursal_id", s.id)

router.push("/seleccionar-caja")

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
background:#c1d9dc;
cursor:pointer;
text-align:center;
}

.card:hover{
background:#2563eb;
color:white;
}

</style>