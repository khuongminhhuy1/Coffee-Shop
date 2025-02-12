import { AxiosServices } from './AxiosServices'

export class AuthServices extends AxiosServices {
  async login(email, password) {
    return await this.post('/login', { email, password })
  }
  async logout() {
    return await this.post('/logout')
  }
  async refreshToken() {
    return await this.post('/refresh-token')
  }
  async register(name, email, password) {
    return await this.post('/register', { name, email, password })
  }
}
export const authServices = new AuthServices()

export class ProductServices extends AxiosServices {
  async getProducts() {
    return await this.get('/product')
  }
}
export const productServices = new ProductServices()

export class AdminServices extends AxiosServices {
  async getUserData() {
    return await this.get('/users')
  }
  async deleteUser(id) {
    return await this.delete(`/user/${id}`)
  }
}
export const adminServices = new AdminServices()

export class UserServices extends AxiosServices {
  async getUserInfo(id) {
    return await this.get(`/user/${id}`)
  }
}
export const userServices = new UserServices()
