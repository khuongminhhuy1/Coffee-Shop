<template>
  <div class="container mx-auto p-6 font-sans">
    <h1 class="text-3xl font-bold mb-6 text-center">My Orders</h1>
    <div v-if="loading" class="text-center text-gray-500">Loading orders...</div>
    <div v-else-if="orders.length === 0" class="text-center text-gray-500">No orders found.</div>
    <div v-else>
      <div
        v-for="order in orders"
        :key="order.id"
        class="border rounded-lg shadow-sm p-4 bg-white mb-4"
      >
        <h2 class="text-xl font-bold text-gray-800">Order #{{ order.orderNumber }}</h2>
        <p class="text-gray-600">
          Status: <span class="font-semibold">{{ order.status }}</span>
        </p>
        <p class="text-gray-600">
          Total: <span class="font-semibold">${{ order.totalAmount.toFixed(2) }}</span>
        </p>
        <div class="mt-2">
          <h3 class="text-lg font-bold">Products:</h3>
          <ul>
            <li v-for="item in order.orderItems" :key="item.id" class="flex items-center mt-2">
              <img
                :src="item.product.images[0]"
                alt="Product Image"
                class="w-16 h-16 rounded-md object-cover mr-4"
              />
              <div>
                <p class="font-semibold text-gray-800">{{ item.product.name }}</p>
                <p class="text-gray-600">{{ item.quantity }} x ${{ item.product.price }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="mt-4 flex space-x-4">
          <button
            v-if="order.status === 'PENDING'"
            @click="cancelOrder(order.id)"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Cancel Order
          </button>
          <button
            v-if="order.status === 'SHIPPED'"
            @click="confirmReceived(order.id)"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Received Item
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrder } from '@/composables/order.composables'

const orders = ref([])
const loading = ref(true)
const order = useOrder()

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const fetchOrders = async () => {
  try {
    const response = await order.getOrders(props.user.id)
    orders.value = response.orders
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

const cancelOrder = async (orderId) => {
  try {
    await order.cancelOrder(orderId) // ✅ Fixed function call
    fetchOrders()
  } catch (error) {
    console.error('Error canceling order:', error)
  }
}

const confirmReceived = async (orderId) => {
  try {
    await order.updateOrderStatus(orderId, 'DELIVERED') // ✅ Fixed function call
    fetchOrders()
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

onMounted(fetchOrders)
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
