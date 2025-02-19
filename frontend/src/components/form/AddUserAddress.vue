<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'

// Props & Emits
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['close'])
const userStore = useUserStore()
// Form State
const form = ref({
  userId: props.user?.id || '',
  address: props.user?.address || '',
  city: props.user?.city || '',
  state: props.user?.state || '',
  zipCode: props.user?.zipCode || '',
  phone: props.user?.phone || '',
  country: props.user?.country || '',
})

// Watch for prop changes (useful when editing an existing address)
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.value = { ...newUser }
    }
  },
)

// Save Address
const saveAddress = async () => {
  try {
    const response = await userStore.saveUserInformation(form.value.userId, form.value)
    if (response.success) {
      emit('close') // Close modal after saving
    }
  } catch (error) {
    console.error('Error saving user address:', error)
  }
}
</script>

<template>
  <form @submit.prevent="saveAddress" class="space-y-4">
    <div class="form-control">
      <label class="label">Address</label>
      <input v-model="form.address" type="text" class="input input-bordered" required />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label">City</label>
        <input v-model="form.city" type="text" class="input input-bordered" required />
      </div>
      <div class="form-control">
        <label class="label">State</label>
        <input v-model="form.state" type="text" class="input input-bordered" required />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label">Zip Code</label>
        <input v-model="form.zipCode" type="text" class="input input-bordered" required />
      </div>
      <div class="form-control">
        <label class="label">Country</label>
        <input v-model="form.country" type="text" class="input input-bordered" required />
      </div>
    </div>

    <div class="form-control">
      <label class="label">Phone</label>
      <input v-model="form.phone" type="text" class="input input-bordered" required />
    </div>

    <!-- Action Buttons -->
    <div class="modal-action">
      <button type="submit" class="btn btn-primary">Save</button>
      <button type="button" class="btn" @click="emit('close')">Cancel</button>
    </div>
  </form>
</template>
