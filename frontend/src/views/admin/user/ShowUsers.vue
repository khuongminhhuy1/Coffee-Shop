<template>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Joined Date</th>
          <th>Verified</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ formatDate(user.createdAt) }}</td>
          <td>{{ user.verified }}</td>
          <td class="flex flex-row">
            <!-- Pass user ID to the UpdateUser component -->
            <UpdateUser :id="user.id" @update="updateUser" />
            <DeleteUser :id="user.id" @delete="removeUser" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import UpdateUser from './modal/UpdateUser.vue'
import DeleteUser from './modal/DeleteUser.vue'
import { useAdmin } from '@/composables/admin.composables'
import { onMounted, ref } from 'vue'

const users = ref([])
const admin = useAdmin()

const formatDate = (dateString) => {
  const dateObject = new Date(dateString)
  return new Intl.DateTimeFormat('default', { dateStyle: 'long' }).format(dateObject)
}

const updateUser = (updatedUser) => {
  const index = users.value.findIndex((user) => user.id === updatedUser.id)
  if (index !== -1) {
    users.value[index] = { ...users.value[index], ...updatedUser } // Update the user in-place
  }
}

// Remove user from the list after deletion
const removeUser = (userId) => {
  users.value = users.value.filter((user) => user.id !== userId)
}

onMounted(async () => {
  try {
    const response = await admin.getUsers()
    console.log('Fetched Users:', response.data.users)
    users.value = response.data.users
  } catch (error) {
    console.error('Error in fetching:', error)
  }
})
</script>
