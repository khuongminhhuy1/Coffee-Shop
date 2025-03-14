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
      // Show success message
      alert('Registration successful! Please check your email to verify your account.')
      // Redirect user to login page
      router.push('/login')
    } catch (error) {
      console.error('Register Error:', error)
      errorMessage.value = error.response?.data?.message || 'Registration failed!'
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
      console.log(decoded)
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
      authStore.setUser() // Reset user state
      router.push('/') // Redirect after logout
    } catch (error) {
      console.error('Logout Error:', error)
    } finally {
      loading.value = false
    }
  }
  async function checkAuthState() {
    loading.value = true
    try {
      // Try to verify current session using cookies
      const response = await authServices.verifySession()
      if (response.data?.user) {
        // If server confirms we're authenticated, set the user
        authStore.setUser(response.data.user)
        return true
      }
      return false
    } catch (error) {
      console.log('No active session or session expired')
      authStore.setUser(null)
      return false
    } finally {
      loading.value = false
    }
  }
  return { register, login, logout, loading, errorMessage, checkAuthState }
}
