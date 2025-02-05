<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login(email, password)">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const email = ref('')
const password = ref('')
const { login, loading, errorMessage } = useAuth()
</script>
