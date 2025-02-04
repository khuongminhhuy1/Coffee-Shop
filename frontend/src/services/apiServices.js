import apiClient from '@/client/apiClient.js'

const authServices = {
  login: (email, password) => apiClient.post('/login', { email, password }),
  logout: () => apiClient.post('/logout'),
  getUserData: () => apiClient.get('/users'),
  refreshToken: () => apiClient.post('/refresh-token'),
  
}

export { authServices }
