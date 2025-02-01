<script setup>
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

// Get access to the store
const auth = useAuth()
const router = useRouter()
const authStore = useAuthStore()
// Handle login redirection
function handleLogin() {
  router.push('/login')
}

// Handle logout
async function handleLogout() {
  await auth.logout()
  router.push('/') // Redirect to login after logging out
}
</script>

<template>
  <div class="flex gap-4">
    <!-- Show Login Button if user is not logged in -->
    <button
      v-if="!authStore.isAuthenticated"
      @click="handleLogin"
      class="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all"
    >
      Login
    </button>

    <!-- Show User's Name or Logout Button if user is logged in -->
    <div v-if="authStore.isAuthenticated">
      <span class="text-lg text-gray-800 font-semibold">{{ authStore.user.name }}</span>
      <button
        @click="handleLogout"
        class="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all"
      >
        Logout
      </button>
    </div>
  </div>
</template>
