<template>
  <div class="w-full mx-auto p-4 bg-white rounded-lg shadow-md text-black">
    <label for="payment-method" class="block text-lg font-semibold mb-2"
      >Select Payment Method:</label
    >

    <select
      v-model="selectedMethod"
      id="payment-method"
      class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      @change="emitPaymentMethod"
    >
      <option v-for="method in paymentMethods" :key="method.value" :value="method.value">
        {{ method.label }}
      </option>
    </select>

    <div v-if="selectedMethod" class="mt-4">
      <p class="text-gray-700">
        You have selected: <span class="font-semibold">{{ selectedMethodLabel }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['update:paymentMethod'])

const selectedMethod = ref('')

const paymentMethods = [
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'PayPal', value: 'PayPal' },
  { label: 'Bank Transfer', value: 'Bank Transfer' },
  { label: 'Cash on Delivery', value: 'Cash on Delivery' },
]

const selectedMethodLabel = computed(() => {
  const method = paymentMethods.find((method) => method.value === selectedMethod.value)
  return method ? method.label : ''
})

const emitPaymentMethod = () => {
  emit('update:paymentMethod', selectedMethod.value)
}
</script>
