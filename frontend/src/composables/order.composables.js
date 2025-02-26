import { orderServices } from '@/services/apiServices'

export function useOrder() {
  async function Checkout(data) {
    try {
      const order = await orderServices.Checkout(data)
      const res = order.data
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      return {}
    }
  }
  async function getOrders(userId) {
    try {
      const orders = await orderServices.getOrders(userId)
      const res = orders.data
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      return []
    }
  }
  return { Checkout, getOrders }
}
