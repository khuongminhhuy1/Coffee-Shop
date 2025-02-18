<template>
  <div class="max-w-md mx-auto p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Reset Password</h2>

    <div v-if="message" class="text-green-500 mb-2">{{ message }}</div>
    <div v-if="error" class="text-red-500 mb-2">{{ error }}</div>

    <form @submit.prevent="resetPassword">
      <div class="mb-4">
        <label class="block text-sm font-medium">New Password</label>
        <input type="password" v-model="newPassword" class="w-full p-2 border rounded" required />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          v-model="confirmPassword"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Reset Password
      </button>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@/composables/user.composables'

const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const message = ref('')
const route = useRoute()
const router = useRouter()
const token = ref('')
const user = useUser()

onMounted(() => {
  token.value = route.query.token
  if (!token.value) {
    error.value = 'Invalid or missing token'
  }
})

const resetPassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    error.value = 'All fields are required'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  } else {
    const response = await user.resetPassword(token.value, newPassword.value)
    message.value = response.data.message
    setTimeout(() => router.push('/login'), 2000)
  }
}
</script>
