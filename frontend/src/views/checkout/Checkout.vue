<template>
  <div class="container mx-auto p-6 font-sans">
    <h1 class="text-3xl font-bold mb-6 text-center">Order Review</h1>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Selected Products Section -->
      <div class="border rounded-lg shadow-sm p-4 bg-white">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Selected Products</h2>
        <div v-for="product in selectedProducts" :key="product.id" class="mb-4">
          <div class="flex items-center">
            <img
              :src="product.image"
              alt="Product Image"
              class="w-16 h-16 rounded-md object-cover mr-4"
            />
            <div>
              <p class="font-semibold text-gray-800">{{ product.name }}</p>
              <p class="text-gray-600">{{ product.quantity }} x ${{ product.price }}</p>
            </div>
          </div>
        </div>
        <p class="mt-4 font-bold text-right">Total: ${{ totalAmount.toFixed(2) }}</p>
      </div>

      <!-- Order Summary Section -->
      <div class="border rounded-lg shadow-sm p-4 bg-white">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Order Details</h2>

        <p><strong>Payment Method:</strong> {{ paymentMethod }}</p>

        <div class="mt-4">
          <p class="text-gray-600">
            <strong>Address:</strong> {{ userInformation.address }}, {{ userInformation.city }},
            {{ userInformation.state }} - {{ userInformation.zipCode }}
          </p>
          <p class="text-gray-600"><strong>Phone:</strong> {{ userInformation.phone }}</p>
        </div>

        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mt-4"
          @click="confirmOrder"
          :disabled="!paymentMethod || !selectedProducts.length"
        >
          Confirm Order
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrder } from '@/composables/order.composables'
import { useUser } from '@/composables/user.composables'

const router = useRouter()
const route = useRoute()
const user = useUser()
const selectedProducts = ref([])
const paymentMethod = ref('')
const userInformation = ref({})
const order = useOrder()
const totalAmount = computed(() =>
  selectedProducts.value.reduce((total, product) => total + product.price * product.quantity, 0),
)

const fetchUserInformation = async () => {
  const auth = JSON.parse(localStorage.getItem('auth'))
  if (!auth || !auth.user.id) {
    console.error('User ID not found')
    return
  }
  try {
    const response = await user.getUserAddress(auth.user.id)
    if (response) {
      userInformation.value = response
    } else {
      console.error('Unexpected response:', response)
    }
  } catch (error) {
    console.error('Error fetching user information:', error)
  }
}
const confirmOrder = async () => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth'))

    if (!auth || !auth.user || !auth.user.id) {
      alert('Error: User ID is missing.')
      return
    }

    if (!selectedProducts.value.length) {
      alert('Error: No products selected.')
      return
    }

    if (!paymentMethod.value) {
      alert('Error: Payment method is required.')
      return
    }

    // ✅ Correctly format products array
    const orderData = {
      userId: auth.user.id,
      products: selectedProducts.value.map((p) => ({
        productId: p.id,
        quantity: p.quantity,
      })),
      paymentMethod: paymentMethod.value,
    }

    console.log('Final Order Data Sent:', orderData) // Debugging

    const response = await order.Checkout(orderData)
    console.log('Order confirmed:', response)
    router.push({ name: 'order-confirmation' })
  } catch (error) {
    console.error('Error confirming order:', error)
    alert(error.response?.data?.error || 'An error occurred while confirming the order.')
  }
}

onMounted(() => {
  const productsQuery = route.query.products
  selectedProducts.value = productsQuery ? JSON.parse(productsQuery) : []
  paymentMethod.value = route.query.paymentMethod || 'Not Selected'
  fetchUserInformation()
})
</script>
