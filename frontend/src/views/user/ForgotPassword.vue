<template>
  <div class="max-w-md mx-auto p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Forgot Password</h2>

    <div v-if="message" class="text-green-500 mb-2">{{ message }}</div>
    <div v-if="error" class="text-red-500 mb-2">{{ error }}</div>

    <form @submit.prevent="requestPasswordReset">
      <div class="mb-4">
        <label class="block text-sm font-medium">Email</label>
        <input type="email" v-model="email" class="w-full p-2 border rounded" required />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Send Reset Link
      </button>
    </form>

    <p class="mt-4 text-sm">
      Remembered your password?
      <router-link to="/login" class="text-blue-500">Login</router-link>
    </p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useUser } from '@/composables/user.composables'

const email = ref('')
const message = ref('')
const error = ref('')
const user = useUser()

const requestPasswordReset = async () => {
  message.value = ''
  error.value = ''

  if (!email.value) {
    error.value = 'Please enter your email'
    return
  }

  try {
    const response = await user.forgotPassword(email.value)
    message.value = response.data.message
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong'
  }
}
</script>
