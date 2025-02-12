import { ref } from 'vue'
import { userServices } from '@/services/apiServices'
import { useAuth } from './useAuth'

export function useUser() {
  const user = ref(null) // Store user data
  const error = ref(null)
  const auth = useAuth()

  async function getUserData(id) {
    try {
      const res = await userServices.getUserInfo(id)
      user.value = res.data.user // Store user data in ref
      return user.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching user data'
      console.log(error.value)

      // Only log out on 401 (unauthorized)
      if (err.response?.status === 401) {
        await auth.logout()
      }
      throw error
    }
  }

  return { user, error, getUserData }
}
