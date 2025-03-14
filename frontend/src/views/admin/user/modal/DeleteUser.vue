<template>
  <!-- The button to open modal -->
  <label :for="deleteModalId" class="btn">Delete</label>

  <!-- Modal -->
  <input type="checkbox" :id="deleteModalId" class="modal-toggle" ref="modalToggle" />
  <div class="modal" role="dialog">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirm Deletion</h3>
      <p class="py-4">Do you want to delete this user?</p>
      <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
      <div class="modal-action">
        <button
          type="button"
          @click="deleteUser"
          class="btn bg-red-500 hover:bg-red-600 text-white"
          :disabled="isDeleting"
        >
          {{ isDeleting ? 'Deleting...' : 'Yes, Delete' }}
        </button>
        <label :for="deleteModalId" class="btn">Cancel</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdmin } from '@/composables/admin.composables'
import { ref, computed } from 'vue'

const admin = useAdmin()
const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
})

const emit = defineEmits(['delete'])
const isDeleting = ref(false)
const error = ref('')

// Compute a unique modal ID
const deleteModalId = computed(() => `delete_modal_${props.id}`)

const deleteUser = async () => {
  try {
    isDeleting.value = true
    console.log(`Attempting to delete user with ID: ${props.id}`)
    await admin.deleteUser(props.id)
    console.log(`Successfully deleted user with ID: ${props.id}`)
    emit('delete', props.id)

    // Close modal after deletion
    document.getElementById(deleteModalId.value).checked = false
  } catch (err) {
    console.error(`Error deleting user ID ${props.id}:`, err)
    error.value = 'Failed to delete user'
  } finally {
    isDeleting.value = false
  }
}
</script>
