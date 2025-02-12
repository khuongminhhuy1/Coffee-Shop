import { adminServices } from '@/services/apiServices'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from './useAuth'
export const useAdmin = () => {
  const authStore = useAuthStore()
  const auth = useAuth()
  async function getUsers() {
    if (!authStore.isAuthenticated) return
    try {
      const response = await adminServices.getUserData() // Call refresh token API
      const res = response.data // Assume response gives token + user data
      console.log(res)
      return res
    } catch (error) {
      console.error('Failed to refresh token, logging out...')
      await auth.logout()
    }
  }
  async function deleteUser(id) {
    if (!authStore.isAuthenticated && authStore.role != 'ADMIN') return
    try {
      await adminServices.deleteUser(id) // Call refresh token API
      console.log('User Deleted')
    } catch (error) {
      console.error('Failed to refresh token, logging out...')
      await auth.logout()
      throw error
    }
  }
  return { getUsers, deleteUser }
}
