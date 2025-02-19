import { defineStore } from 'pinia'
import { userServices } from '@/services/apiServices'


export const useUserStore = defineStore('information', {
  state: () => ({
    information: {},
  }),
  persist: {
    key: 'information',
    storage: window.localStorage,
    paths: ['information'],
  },
  actions: {
    async saveUserInformation(userId, data) {
      try {
        const response = await userServices.saveUserInfo(userId, data)
        this.information = response.userInfo
        return { success: true, message: response.message }
      } catch (error) {
        console.error('Error saving user information:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Something went wrong',
          error,
        }
      }
    },
    async getUserInformation(userId) {
      try {
        const response = await userServices.getUserInfo(userId)
        this.information = response
        return { success: true, message: 'User information fetched' }
      } catch (error) {
        console.error('Error fetching user information:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Something went wrong',
          error,
        }
      }
    },
    async deleteUserInformation(userId) {
      try {
        await userServices.deleteUserInfo(userId)
        this.information = {}
        return { success: true, message: 'User information deleted' }
      } catch (error) {
        console.error('Error deleting user information:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Something went wrong',
          error,
        }
      }
    },
  },
})
