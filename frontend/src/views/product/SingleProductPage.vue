<template>
  <div class="flex flex-col items-center p-6">
    <div v-if="loading" class="text-lg font-semibold text-gray-700">Loading product details...</div>
    <div
      v-else-if="product"
      class="w-full max-w-5xl p-4 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6"
    >
      <!-- Product Image -->
      <div class="w-full lg:w-1/2 border p-2 rounded-md backdrop-blur border-amber-600">
        <img
          :src="activeImage"
          alt="Product Image"
          class="w-full h-auto object-cover rounded-lg shadow"
        />
        <!-- Image Carousel -->
        <div class="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
          <img
            v-for="(image, index) in product.images"
            :key="index"
            :src="image.url"
            :alt="`Product Image ${index + 1}`"
            class="w-20 h-20 object-cover rounded-md cursor-pointer border-2"
            :class="{
              'border-amber-600': activeImage === image.url,
              'border-gray-300': activeImage !== image.url,
            }"
            @click="activeImage = image.url"
          />
        </div>
      </div>
      <!-- Product Details -->
      <div class="w-full lg:w-1/2 flex flex-col">
        <div class="w-full border p-2 border-amber-600 rounded-md backdrop-blur">
          <div class="w-full flex flex-col items-center gap-4">
            <h1 class="text-2xl font-bold mb-4 text-white">{{ product.name }}</h1>
            <p class="text-white text-base md:text-lg mb-4">{{ product.description }}</p>
            <div class="text-xl font-semibold text-amber-600 mb-4 w-full text-center">
              Price: ${{ product.price }}
            </div>
            <div
              class="flex items-center space-x-4 border p-2 rounded-md border-amber-600 text-white"
            >
              <button
                @click="decrementQuantity"
                :disabled="quantity <= 1"
                class="btn bg-amber-600 border-none hover:bg-amber-700"
              >
                -
              </button>
              <span>{{ quantity }}</span>
              <button
                @click="incrementQuantity"
                class="btn bg-amber-600 border-none hover:bg-amber-700"
              >
                +
              </button>
            </div>
            <button
              class="btn border-none bg-amber-500 hover:bg-amber-600 text-white rounded px-6 py-3 text-base md:text-lg w-full"
              @click="addToCart"
            >
              Add to Cart
            </button>
          </div>
        </div>
        <div
          class="w-full border border-amber-600 h-96 mt-2 rounded-md backdrop-blur p-4 text-white"
        >
          <p class="font-semibold">
            FaunaMart Online Store <br />
            - All orders placed on the FaunaMart Online Store during the specified preorder period
            are guaranteed to be fulfilled.* <br />
            *Please note that this does not apply to orders with incorrect payment and/or shipping
            information provided. <br />
            *Dates and times listed are in Japan Standard Time (JST) unless otherwise stated.
          </p>
          <p class="font-semibold pt-8">
            International Partner Shops<br />- This product is available from our partner shops.
          </p>
        </div>
      </div>
    </div>
    <div v-else class="text-red-500 text-lg font-semibold">
      Failed to load product details. Please try again.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProduct } from '@/composables/product.composables'
import { useRoute } from 'vue-router'
import { useCart } from '@/composables/cart.composables'

const route = useRoute()

const product = ref(null)
const loading = ref(true)
const error = ref(null)
const activeImage = ref(null)
const quantity = ref(1)
const productData = useProduct()
const cart = useCart()

const fetchProduct = async () => {
  try {
    const response = await productData.getSingleProduct(route.params.id)
    product.value = response.product
    console.log(response.product)
    if (product.value.images && product.value.images.length > 0) {
      activeImage.value = product.value.images[0].url
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

const authData = JSON.parse(localStorage.getItem('auth'))
const isAuthenticated = () => {
  return authData.isAuthenticated === true
}

const addToCart = async () => {
  if (!isAuthenticated()) {
    alert('You need to log in to add items to the cart.')
    return
  }

  try {
    await cart.addToCart({
      userId: authData.user.id,
      productId: product.value.id,
      name: product.value.name,
      price: product.value.price,
      quantity: quantity.value,
    })
    alert('Product added to cart')
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
