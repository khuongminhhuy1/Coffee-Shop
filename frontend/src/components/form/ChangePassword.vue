<script setup>
import { ref } from 'vue'
import { useUser } from '@/composables/user.composables'

// State
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const user = useUser()

const props = defineProps({
  user: Object, // Receiving the user object from the parent
})

// Validation and API request
const changePassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'All fields are required.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'New passwords do not match.'
    return
  }

  try {
    // Updated function call, passing arguments directly
    const response = await user.changePassword(oldPassword.value, newPassword.value)

    successMessage.value = response.data.message
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Something went wrong.'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Change Password</h2>

    <div v-if="errorMessage" class="text-red-500 mb-2">{{ errorMessage }}</div>
    <div v-if="successMessage" class="text-green-500 mb-2">{{ successMessage }}</div>

    <form @submit.prevent="changePassword">
      <div class="mb-4">
        <label class="block text-sm font-medium">Old Password</label>
        <input type="password" v-model="oldPassword" class="w-full p-2 border rounded" required />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">New Password</label>
        <input type="password" v-model="newPassword" class="w-full p-2 border rounded" required />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Confirm New Password</label>
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
        Change Password
      </button>
    </form>
  </div>
</template>
