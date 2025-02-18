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
  async function changePassword(oldPassword, newPassword) {
    try {
      await userServices.changePassword(oldPassword, newPassword)
      console.log('Password changed successfully')

      // Show success message to user
      alert('Password changed successfully')
    } catch (error) {
      console.error('Error changing password:', error)

      // Handle specific errors
      if (error.response?.data?.error) {
        alert(error.response.data.error) // Show API error message
      } else {
        alert('Something went wrong. Please try again.')
      }
    }
  }
  async function forgotPassword(email) {
    try {
      await userServices.forgotPassword(email)
      console.log('Email sent')
    } catch (error) {
      console.log(error)
    }
  }
  async function resetPassword(token, newPassword) {
    try {
      await userServices.resetPassword(token, newPassword)
      console.log('success')
    } catch (error) {
      console.log('err during reset pwd :', error)
    }
  }
  return { user, error, getUserData, changePassword, forgotPassword, resetPassword }
}
