import { defineStore } from 'pinia'
import { authServices } from '@/services/apiServices'
import AdminUser from '../models/user/AdminUser'
import NormalUser from '../models/user/NormalUser'
import { useCookies } from 'vue3-cookies'
import { jwtDecode } from 'jwt-decode'

const { cookies } = useCookies()
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
    initAuth() {
      // Log cookies to see what is available
      console.log('Cookies:', cookies.get()) // log all cookies
      const token = cookies.get('token')

      console.log('Token found in initAuth:', token)

      if (token) {
        try {
          const decoded = jwtDecode(token)
          console.log('Decoded token:', decoded)
          this.setUser(decoded) // Initialize user from the token
        } catch (error) {
          console.error('Error decoding token:', error)
        }
      } else {
        console.log('No token found in cookies.')
      }
    },
  },
})
