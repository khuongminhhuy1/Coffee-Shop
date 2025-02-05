import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { API_SERVER_URL } from '@/constants'

export class AxiosServices {
  apiClient = axios.create({
    baseURL: API_SERVER_URL, // Change this to your backend URL
    withCredentials: true, // Ensure cookies are sent with requests
  })

  constructor() {
    // Response Interceptor: Handle expired tokens
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const authStore = useAuthStore()
        const originalRequest = error.config

        // If the token expired, try refreshing it
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshResponse = await axios.get(`${API_SERVER_URL}/refresh-token`, {
              withCredentials: true,
            })
            console.log(refreshResponse.data.accessToken)

            return this.apiClient(originalRequest)
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
            authStore.logout()
          }
        }

        return Promise.reject(error)
      },
    )
  }

  async get(slug) {
    return await this.apiClient.get(slug)
  }

  async post(slug, data) {
    return await this.apiClient.post(slug, data)
  }

  async put(slug, data) {
    return await this.apiClient.put(slug, data)
  }

  async delete(slug) {
    return await this.apiClient.delete(slug)
  }
}
