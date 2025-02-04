import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { authServices } from '@/services/apiServices'
import { jwtDecode } from 'jwt-decode'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const loading = ref(false)
  const errorMessage = ref('')

  async function register(name, email, password) {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await authServices.register(name, email, password)
      const {
        data: { user },
      } = response.data
      console.log(user)
    } catch (error) {
      console.error('Register Error:', error)
      errorMessage.value = error.response?.data?.message || 'Register failed!'
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await authServices.login(email, password)
      const token = response.data.data.token
      const decoded = jwtDecode(token)
      authStore.setUser(decoded)
      router.push('/') // Redirect after login
    } catch (error) {
      console.error('Login Error:', error)
      errorMessage.value = error.response?.data?.message || 'Login failed!'
    } finally {
      loading.value = false
    }
  }
  async function logout() {
    loading.value = true
    try {
      await authServices.logout()
      authStore.logout() // Reset user state
      router.push('/') // Redirect after logout
    } catch (error) {
      console.error('Logout Error:', error)
    } finally {
      loading.value = false
    }
  }
  return { register, login, logout, loading, errorMessage }
}
