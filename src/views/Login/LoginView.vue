<template>
<div class="login-container">

  <div class="login-card">

    <h2>Sistema POS</h2>

    <input
      v-model="email"
      type="email"
      placeholder="Correo"
    />

    <input
      v-model="password"
      type="password"
      placeholder="Contraseña"
    />

    <button @click="login">
      Ingresar
    </button>

  </div>

</div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")

const login = async () => {

  try {

    const res = await axios.post("https://api-farmacia.test/api/login", {
      email: email.value,
      password: password.value
    })

    localStorage.setItem("token", res.data.token)
    localStorage.setItem("user", JSON.stringify(res.data.user))
console.log(localStorage.getItem("token"))
    router.push("/seleccionar-sucursal")

  } catch (error) {

    alert("Credenciales incorrectas")

  }

}
</script>

<style scoped>

.login-container{
display:flex;
justify-content:center;
align-items:center;
height:100vh;
background:#f3f4f6;
}

.login-card{
width:320px;
padding:30px;
background:white;
border-radius:10px;
box-shadow:0 4px 10px rgba(0,0,0,0.1);
display:flex;
flex-direction:column;
gap:10px;
}

input{
padding:10px;
border:1px solid #ddd;
border-radius:5px;
}

button{
padding:10px;
background:#2563eb;
color:white;
border:none;
border-radius:5px;
cursor:pointer;
}

</style>