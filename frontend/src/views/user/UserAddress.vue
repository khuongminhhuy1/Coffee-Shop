<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import AddUserAddress from '@/components/form/AddUserAddress.vue'
import { useUser } from '@/composables/user.composables'

// Props & Emits
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const userStore = useUserStore()
const isModalOpen = ref(false)
const user = useUser()
// Open modal
const openModal = () => {
  isModalOpen.value = true
}

// Close modal
const closeModal = () => {
  isModalOpen.value = false
}

// Fetch user information on mount
onMounted(async () => {
  try {
    const userData = await user.getUserAddress(props.user.id)
    userStore.information = userData
  } catch (error) {
    console.error('Error fetching user information:', error)
  }
})

// Delete address
const deleteAddress = async () => {
  if (confirm('Are you sure you want to delete your address?')) {
    try {
      const response = await userStore.deleteUserInformation(userStore.user.id)
      if (response.success) {
        userStore.information = null // Reset address after deletion
      } else {
        console.error('Failed to delete address:', response.message)
      }
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }
}
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Your Address</h1>

    <!-- Add Address Button -->
    <div class="py-2 flex items-end justify-end">
      <button @click="openModal" class="btn btn-primary">Add New Address</button>
    </div>

    <!-- Display Address -->
    <div
      v-if="userStore.information?.address"
      class="flex items-center justify-between bg-gray-900 p-4 rounded-lg shadow-md"
    >
      <div>
        <p>
          {{ userStore.information.address }}, {{ userStore.information.city }},
          {{ userStore.information.state }},
          {{ userStore.information.zipCode }}
        </p>
        <p>{{ userStore.information.phone }} | {{ userStore.information.country }}</p>
      </div>
      <div class="flex space-x-2">
        <button @click="openModal" class="btn btn-warning">Edit</button>
        <button @click="deleteAddress" class="btn btn-danger">Delete</button>
      </div>
    </div>
    <p v-else class="text-gray-500">No address found. Add one above.</p>

    <!-- Modal for Adding/Editing Address -->
    <dialog :open="isModalOpen" role="dialog" aria-labelledby="modal-title" class="modal">
      <div class="modal-box">
        <h2 id="modal-title" class="text-lg font-bold">Add/Edit Address</h2>
        <AddUserAddress :user="props.user" @close="closeModal" />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeModal" aria-label="Close modal">Close</button>
      </form>
    </dialog>
  </div>
</template>
