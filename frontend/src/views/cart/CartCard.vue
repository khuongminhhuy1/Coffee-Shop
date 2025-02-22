<template>
  <div
    class="flex flex-col lg:flex-row items-center justify-between bg-white rounded-lg shadow-md p-4 mb-4"
  >
    <!-- Left side: Checkbox + Image + Product Info -->
    <div class="flex items-center flex-grow space-x-4">
      <!-- Checkbox -->
      <input
        type="checkbox"
        :checked="isSelected"
        @change="updateSelection"
        class="mr-4 cursor-pointer"
      />

      <!-- Product Image -->
      <div class="flex-shrink-0">
        <img :src="item.image" :alt="item.name" class="w-[80px] h-[80px] rounded-lg object-cover" />
      </div>

      <!-- Product Info -->
      <div class="flex-grow">
        <h2 class="text-lg font-semibold text-black truncate">{{ item.name }}</h2>
        <p class="text-gray-600 text-sm">Price: ${{ item.price }}</p>

        <!-- Quantity Input -->
        <div class="flex items-center space-x-2 mt-2">
          <label class="text-sm text-gray-600">Quantity:</label>
          <input
            type="number"
            v-model="quantity"
            min="1"
            class="w-12 p-1 border border-gray-300 rounded text-black"
            @change="updateQuantity"
          />
        </div>

        <!-- Total Price Calculation -->
        <p class="text-gray-600 text-sm mt-2">Total: ${{ totalPrice.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Right side: Remove Button -->
    <div class="flex-shrink-0 mt-4 lg:mt-0">
      <button @click="removeItem" class="text-red-500 text-sm hover:underline focus:outline-none">
        Remove
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Define props
const props = defineProps({
  item: Object,
  isSelected: Boolean, // Receives the selection state from the parent
})

// Define emits
const emit = defineEmits(['update:selected', 'removeItemFromCart', 'update:quantity'])

// Local state for quantity
const quantity = ref(props.item.quantity)

// Computed property for total price
const totalPrice = computed(() => props.item.price * quantity.value)

// Methods
const updateSelection = (event) => {
  emit('update:selected', { id: props.item.id, isSelected: event.target.checked })
}

const removeItem = () => {
  emit('removeItemFromCart', props.item.id)
}

const updateQuantity = () => {
  emit('update:quantity', {
    id: props.item.id,
    quantity: quantity.value,
    price: props.item.price,
  })
}
</script>

<style scoped>
/* Scoped styling */
</style>
