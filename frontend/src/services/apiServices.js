import axios from 'axios'
import { API_SERVER_URL } from '../constants/index.js'

axios.defaults.withCredentials = true

const authServices = {
  async login(email, password) {
    const response = await axios.post(
      `${API_SERVER_URL}/login`,
      { email, password },
      { withCredentials: true },
    )
    return response.data
  },

  async logout() {
    const response = await axios.post(`${API_SERVER_URL}/logout`, {}, { withCredentials: true })
    return response.data
  },
}

export { authServices }
