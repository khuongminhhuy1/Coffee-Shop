import { categoryServices } from '@/services/apiServices'

export function useCategory() {
  async function getCategories() {
    try {
      const categories = await categoryServices.getCategories()
      const res = categories.data
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      return []
    }
  }
  async function addCategory(name) {
    try {
      const category = await categoryServices.addCategory(name)
      const res = category.data
      console.log('added:', res)
      return res
    } catch (error) {
      console.log(error)
      return {}
    }
  }
  async function updateCategory(id, data) {
    try {
      const category = await categoryServices.updateCategory(id, data)
      const res = category.data
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      return {}
    }
  }
  async function deleteCategory(id) {
    try {
      const category = await categoryServices.deleteCategory(id)
      const res = category.data
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      return {}
    }
  }
  return { getCategories, addCategory, updateCategory, deleteCategory }
}
