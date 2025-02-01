import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { authServices } from '@/services/apiServices'
import { useCookies } from 'vue3-cookies'
import { jwtDecode } from 'jwt-decode'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const loading = ref(false)
  const errorMessage = ref('')
  const { cookies } = useCookies()

  onMounted(() => {
    const token = cookies.get('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        authStore.setUser(decoded) // Assuming `setUser` stores the user data in the store
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  })

  async function login(email, password) {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await authServices.login(email, password)
      const token = response.data.token
      cookies.set('token', token, { path: '/', expires: '1h' })
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
      // Clear token from cookies
      cookies.remove('token', { path: '/' })
      authStore.logout() // Reset user state
      router.push('/') // Redirect after logout
    } catch (error) {
      console.error('Logout Error:', error)
    } finally {
      loading.value = false
    }
  }
  return { login, logout, loading, errorMessage }
}
