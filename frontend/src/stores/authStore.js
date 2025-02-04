import { defineStore } from 'pinia'
import AdminUser from '../models/user/AdminUser'
import NormalUser from '../models/user/NormalUser'
import { authServices } from '@/services/apiServices'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    setUser(data) {
      this.user =
        data.role === 'ADMIN'
          ? new AdminUser(data.name, data.email)
          : new NormalUser(data.name, data.email)
      this.isAuthenticated = true
    },

    async logout() {
      try {
        this.user = null
        this.isAuthenticated = false
      } catch (error) {
        console.error('Error during logout:', error)
      }
    },
    async initAuth() {
      if (!this.isAuthenticated) return;
      try {
        const response = await authServices.getUserData() // Call refresh token API
        const res = response.data // Assume response gives token + user data
        console.log(res)
      } catch (error) {
        console.error('Failed to refresh token, logging out...')
        this.logout()
      }
    },
  },
})
