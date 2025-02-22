import { productServices } from '@/services/apiServices'

export function useProduct() {
  async function getProductData() {
    try {
      const product = await productServices.getProducts()
      const res = product.data
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      return []
    }
  }
  async function getSingleProduct(id) {
    try {
      const product = await productServices.getSingleProduct(id)
      const res = product.data
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      return {}
    }
  }
  return { getProductData, getSingleProduct }
}
