<template>
  <div class="overflow-x-auto">
    <h1 class="text-3xl pb-5">Categories</h1>
    <form @submit.prevent="createCategory" class="space-x-4 mb-6">
      <input
        v-model="newCategory.name"
        placeholder="Category Name"
        class="border p-2 rounded w-1/3"
        required
      />
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Add</button>
    </form>
    <table class="table w-full">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="category.id">
          <td>{{ index + 1 }}</td>
          <td>{{ category.name }}</td>
          <td>{{ category.total }}</td>
          <td class="flex flex-row">
            <DeleteCategory :id="category.id" @delete="removeCategory" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import DeleteCategory from './modal/DeleteCategory.vue'
import { useCategory } from '@/composables/category.composables'
import { onMounted, ref } from 'vue'

const categories = ref([])
const categoryStore = useCategory()
const newCategory = ref({ name: '' })

// Remove category after deletion
const removeCategory = (categoryId) => {
  // Ensure ID is compared properly (without forcing number conversion)
  categories.value = categories.value.filter((category) => category.id !== categoryId)
}
const createCategory = async () => {
  if (!newCategory.value.name.trim()) return
  try {
    const response = await categoryStore.addCategory(newCategory.value)
    categories.value.push(response.data)
    newCategory.value.name = '' // Reset input
    await categoryStore.getCategories()
  } catch (error) {
    console.error('Failed to create category:', error)
  }
}
// Fetch categories on mount
onMounted(async () => {
  try {
    const response = await categoryStore.getCategories()
    console.log('Fetched Categories:', response)
    categories.value = response
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
})
</script>
