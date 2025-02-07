<template>
  <div class="py-12 ">
    <h2
      class="w-full flex flex-row justify-center items-center text-4xl uppercase bg-gradient-to-l from-amber-600 via-amber-700 to-amber-900 text-transparent bg-clip-text font-bold mb-6"
    >
      Our Products
    </h2>

    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <ProductCard v-for="product in limitedProducts" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script>
import ProductCard from '../product/ProductCard.vue'
import { getProductData } from '@/composables/product.composables'

export default {
  name: 'ProductPresentation',
  components: {
    ProductCard,
  },
  data() {
    return {
      products: [],
    }
  },
  computed: {
    limitedProducts() {
      return this.products.slice(0, 5) // ✅ Limits to 4 products
    },
  },
  async mounted() {
    try {
      const data = await getProductData()
      console.log('Fetched Products:', data) // Debugging line
      this.products = data.products
    } catch (error) {
      console.error('Error in fetching products:', error)
    }
  },
}
</script>
