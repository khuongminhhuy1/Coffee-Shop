<template>
  <div>
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-white pb-3">Name</label>
        <input
          v-model="localUser.name"
          type="text"
          id="name"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-white pb-3">Email</label>
        <input
          v-model="localUser.email"
          type="email"
          id="email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          disabled
          readonly
        />
      </div>

      <!-- Update Button -->
      <div class="text-right">
        <button
          type="submit"
          class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-profile'])

// Create a reactive local copy of the user
const localUser = reactive({ ...props.user })

// Watch for parent prop updates and sync changes
watch(
  () => props.user,
  (newUser) => {
    Object.assign(localUser, newUser) // Deeply updates localUser
  },
  { deep: true },
)

// Emit updated data when form is submitted
const submitForm = () => {
  emit('update-profile', localUser)
}
</script>
