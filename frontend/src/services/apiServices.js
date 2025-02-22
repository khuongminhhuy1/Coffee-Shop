import { AxiosServices } from './AxiosServices'

export class AuthServices extends AxiosServices {
  async login(email, password) {
    return await this.post('/login', { email, password })
  }
  async logout() {
    return await this.post('/logout')
  }
  async refreshToken() {
    return await this.post('/refresh-token', {})
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
  async getSingleProduct(id) {
    return await this.get(`/product/${id}`)
  }
}
export const productServices = new ProductServices()

export class CartServices extends AxiosServices {
  async getCart(userId) {
    return await this.get(`/cart/${userId}`)
  }
  async addToCart(data) {
    return await this.post('/cart/add', data)
  }
  async deleteCart(id) {
    return await this.delete(`/cart/${id}`)
  }
}
export const cartServices = new CartServices()

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
  async changePassword(oldPassword, newPassword) {
    return await this.put(`/change-password`, { oldPassword, newPassword })
  }
  async forgotPassword(email) {
    return await this.post(`/forgot-password`, { email })
  }
  async resetPassword(token, password) {
    return await this.post(`/reset-password?token=${token}`, { password })
  }
  async getUserAddress(id) {
    return await this.get(`/profile/${id}`)
  }
  async saveUserInfo(userId, data) {
    return await this.post(`/profile/${userId}`, data)
  }
  async deleteUserInfo(userId) {
    return await this.delete(`/profile/${userId}`)
  }
}
export const userServices = new UserServices()
