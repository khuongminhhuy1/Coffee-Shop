import { defineStore } from 'pinia'
import AdminUser from '@/services/user/AdminUser'
import NormalUser from '@/services/user/NormalUser'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  persist: {
    key: 'auth',
    storage: window.localStorage,
  },
  actions: {
    setUser(data) {
      if (data) {
        this.user =
          data.role === 'ADMIN'
            ? new AdminUser(data.id, data.name, data.email, data.avatar)
            : new NormalUser(data.id, data.name, data.email, data.avatar)
        this.isAuthenticated = true
      } else {
        this.user = null
        this.isAuthenticated = false
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
    },
  },
})
