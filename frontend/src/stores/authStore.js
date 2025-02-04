import { defineStore } from 'pinia'
import AdminUser from '../models/user/AdminUser'
import NormalUser from '../models/user/NormalUser'
import { authServices } from '@/services/apiServices'
import { useCookies } from 'vue3-cookies'

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
      try {
        const cookies = useCookies()
        const response = authServices.refreshToken() // Call refresh token API
        const { token, user } = response.data // Assume response gives token + user data

        cookies.set('token', token) // Save new token
        this.setUser(user) // Set user from refreshed data

        console.log('User refreshed:', user)
      } catch (error) {
        console.error('Failed to refresh token, logging out...')
        this.logout()
      }
    },
  },
})
