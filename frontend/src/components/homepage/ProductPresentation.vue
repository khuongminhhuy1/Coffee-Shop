<template>
  <div class="py-12">
    <h2
      class="w-full flex flex-row justify-center items-center text-4xl uppercase bg-gradient-to-l from-amber-600 via-amber-700 to-amber-900 text-transparent bg-clip-text font-bold mb-6"
    >
      Our Products
    </h2>

    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <ProductCard
        v-for="product in limitedProducts"
        :key="product.id"
        :product="product"
        @click="gotoProduct(product.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ProductCard from '../product/ProductCard.vue'
import { useProduct } from '@/composables/product.composables'
import { useRouter } from 'vue-router'

const products = ref([])
const product = useProduct()
const router = useRouter()

const limitedProducts = computed(() => products.value.slice(0, 5))

async function gotoProduct(id) {
  router.push({ name: 'single-product', params: { id } })
}
onMounted(async () => {
  try {
    const data = await product.getProductData()
    console.log('Fetched Products:', data) // Debugging line
    products.value = data.products
  } catch (error) {
    console.error('Error in fetching products:', error)
  }
})
</script>
