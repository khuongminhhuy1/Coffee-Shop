import { productServices } from '@/services/apiServices'

export async function getProductData() {
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
