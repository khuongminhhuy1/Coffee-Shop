import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { API_SERVER_URL } from '@/constants'

export class AxiosServices {
  apiClient = axios.create({
    baseURL: API_SERVER_URL,
    withCredentials: true, // Ensure cookies are sent with requests
  })

  constructor() {
    // Request Interceptor: Use token from cookie or store
    this.apiClient.interceptors.request.use(
      (config) => {
        // We don't need to manually add the token since it's in the HttpOnly cookie
        // and will be automatically sent with the request due to withCredentials: true
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response Interceptor: Handle expired tokens
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const authStore = useAuthStore()
        const originalRequest = error.config

        // If the token expired (403 Forbidden), try refreshing it
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            // The /refresh-token endpoint will set new cookies automatically
            await axios.get(`${API_SERVER_URL}/refresh-token`, {
              withCredentials: true,
            })
            
            // Retry the original request - the new cookies will be sent automatically
            return this.apiClient(originalRequest)
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
            authStore.logout()
            return Promise.reject(refreshError)
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