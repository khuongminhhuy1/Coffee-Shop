import { defineStore } from 'pinia'
import AdminUser from '@/services/user/AdminUser'
import NormalUser from '@/services/user/NormalUser'
import { ref } from 'vue'

const authStore = () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const setUser = (data) => { //set data undefined to logout
    if (data) {
      user.value =
        data.role === 'ADMIN'
          ? new AdminUser(data.name, data.email)
          : new NormalUser(data.name, data.email)
      isAuthenticated.value = true
    } else {
      user.value = null
      isAuthenticated.value = false
    }
  }

  return { user, isAuthenticated, setUser }
}

export const useAuthStore = defineStore('auth', authStore)
