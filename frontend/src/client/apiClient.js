import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useCookies } from 'vue3-cookies'
import { API_SERVER_URL } from '@/constants'

const { cookies } = useCookies()

const apiClient = axios.create({
  baseURL: API_SERVER_URL, // Change this to your backend URL
  withCredentials: true, // Ensure cookies are sent with requests
})

// Request Interceptor: Add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = cookies.get('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => Promise.reject(error),
)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await axios.post('/refresh-token', {})

        cookies.set('token', data.token)
        cookies.set('refreshToken', data.refreshToken)

        error.config.headers['token'] = data.accessToken
        return api.request(error.config) // Retry failed request
      } catch (err) {
        console.error('Refresh failed, logging out...')
        cookies.remove('token')
        cookies.remove('refreshToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

// Response Interceptor: Handle expired tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    // If the token expired, try refreshing it
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshResponse = await axios.get(`${API_SERVER_URL}/refresh-token`, {
          withCredentials: true,
        })

        const newToken = refreshResponse.data.token
        cookies.set('token', newToken)

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        authStore.logout()
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
