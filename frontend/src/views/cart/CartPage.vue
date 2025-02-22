<template>
  <div class="container mx-auto p-6 font-sans">
    <h1 class="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Cart Items Section -->
      <div class="w-full lg:w-2/3">
        <div class="border rounded-lg shadow-sm p-4 bg-white">
          <div v-if="cartItems.length > 0">
            <!-- Select All Checkbox -->
            <div class="flex items-center mb-4">
              <input
                type="checkbox"
                :checked="isSelectAllChecked"
                @change="toggleSelectAll"
                class="mr-4"
              />
              <label class="text-black font-bold">Select All</label>
            </div>

            <!-- Individual Cart Items -->
            <CartCard
              v-for="item in paginatedItems"
              :key="item.id"
              :item="item"
              :isSelected="selectedItems.includes(item.id)"
              @update:selected="updateSelection"
              @update:quantity="updateQuantity"
              @removeItemFromCart="removeItem"
            />

            <!-- Pagination -->
            <div class="flex justify-between items-center mt-4">
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                :disabled="currentPage === 1"
                @click="prevPage"
              >
                Previous
              </button>
              <span class="font-semibold">Page {{ currentPage }} of {{ totalPages }}</span>
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                Next
              </button>
            </div>
          </div>
          <div v-else>
            <p class="text-gray-600 text-center py-6">Your cart is empty.</p>
          </div>
        </div>
      </div>

      <!-- Order Summary Section -->
      <div class="w-full lg:w-1/3">
        <PaymentMethod @update:paymentMethod="updatePaymentMethod" />
        <div class="border rounded-lg shadow-sm p-4 bg-white mt-4">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
          <div class="mb-4">
            <p class="flex justify-between text-gray-600">
              <span>Selected Items:</span>
              <span>{{ selectedItems.length }}</span>
            </p>
            <p class="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${{ selectedTotal.toFixed(2) }}</span>
            </p>
          </div>
          <button
            class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            :disabled="selectedItems.length === 0"
            @click="goToCheckout"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCart } from '@/composables/cart.composables'
import CartCard from './CartCard.vue'
import { useRouter } from 'vue-router'
import PaymentMethod from '@/components/checkout/PaymentMethod.vue'

const router = useRouter()
const cart = useCart()
// State Variables
const cartItems = ref([])
const selectedItems = ref([])
const currentPage = ref(1)
const itemsPerPage = 5
const paymentMethod = ref('')

// Fetch Cart Items
const fetchCartItems = async () => {
  const auth = JSON.parse(localStorage.getItem('auth'))
  if (!auth || !auth.user.id) {
    console.error('User ID not found')
    return
  }

  try {
    const response = await cart.getCartData(auth.user.id)
    if (response) {
      cartItems.value = response.cartItems.map((item) => ({
        id: item.id,
        name: item.Product.name,
        price: item.Product.price,
        image: item.Product.images?.[0]?.url || '',
        quantity: item.quantity,
      }))
    } else {
      console.error('Unexpected response structure:', response)
    }
  } catch (error) {
    console.error('Error fetching cart items:', error)
  }
}

// Computed Properties
const selectedTotal = computed(() =>
  cartItems.value
    .filter((item) => selectedItems.value.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0),
)

const totalPages = computed(() => Math.ceil(cartItems.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return cartItems.value.slice(start, start + itemsPerPage)
})

const isSelectAllChecked = computed(() =>
  paginatedItems.value.every((item) => selectedItems.value.includes(item.id)),
)

// Methods
const updatePaymentMethod = (method) => {
  paymentMethod.value = method
}

const updateSelection = ({ id, isSelected }) => {
  if (isSelected) {
    if (!selectedItems.value.includes(id)) selectedItems.value.push(id)
  } else {
    selectedItems.value = selectedItems.value.filter((selectedId) => selectedId !== id)
  }
}

const updateQuantity = ({ id, quantity }) => {
  const item = cartItems.value.find((item) => item.id === id)
  if (item) item.quantity = quantity
}

const toggleSelectAll = () => {
  if (isSelectAllChecked.value) {
    selectedItems.value = selectedItems.value.filter(
      (id) => !paginatedItems.value.some((item) => item.id === id),
    )
  } else {
    selectedItems.value = [
      ...new Set([...selectedItems.value, ...paginatedItems.value.map((item) => item.id)]),
    ]
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const removeItem = async (itemId) => {
  try {
    await cart.deleteCart(itemId)
    cartItems.value = cartItems.value.filter((item) => item.id !== itemId)
    selectedItems.value = selectedItems.value.filter((id) => id !== itemId)
  } catch (error) {
    console.error('Error removing item:', error)
    alert('Failed to remove item. Please try again.')
  }
}
const goToCheckout = () => {
  const selectedProducts = cartItems.value.filter((item) => selectedItems.value.includes(item.id))

  router.push({
    name: 'checkout',
    query: {
      products: JSON.stringify(selectedProducts),
      paymentMethod: paymentMethod.value,
    },
  })
}

// Lifecycle Hook
onMounted(fetchCartItems)
</script>
