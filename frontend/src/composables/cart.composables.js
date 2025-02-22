import { cartServices } from '@/services/apiServices'

export function useCart() {
  async function getCartData(userId) {
    try {
      const cart = await cartServices.getCart(userId)
      const res = cart.data
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      return []
    }
  }
  async function addToCart(data) {
    try {
      const cart = await cartServices.addToCart(data)
      const res = cart.data
      console.log('added:', res)
      return res
    } catch (error) {
      console.log(error)
      return {}
    }
  }
  async function deleteCart(id) {
    try {
      const cart = await cartServices.deleteCart(id)
      const res = cart.data
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      return {}
    }
  }
  return { getCartData, addToCart, deleteCart }
}
