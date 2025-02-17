<template>
  <div class="w-full mx-auto px-4 py-6 bg-gray-800 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6 text-white text-center">My Profile</h1>

    <div v-if="user">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left Column: Avatar + Menu (3/10 on Desktop, Full-width on Mobile) -->
        <div class="w-full md:w-3/10 flex flex-col items-center space-y-6">
          <!-- Avatar -->
          <div class="flex flex-col items-center">
            <img
              :src="user.avatar"
              alt="User Avatar"
              class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg"
            />
            <div class="mt-4">
              <input type="file" id="avatar-upload" @change="handleAvatarChange" class="hidden" />
              <label
                for="avatar-upload"
                class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Change Avatar
              </label>
            </div>
          </div>

          <!-- Menu -->
          <div class="w-full text-center md:text-left">
            <ul class="w-full space-y-2 text-white">
              <li class="bg-gray-700 p-3 rounded-md">
                <details open>
                  <summary class="cursor-pointer font-semibold">Basic Profile</summary>
                  <ul class="pl-4 mt-2 space-y-1">
                    <router-link to="/profile/information">
                      <li class="hover:text-emerald-400">Account</li>
                    </router-link>
                    <router-link to="/profile/address">
                      <li class="hover:text-emerald-400">Address</li>
                    </router-link>
                    <router-link to="/profile/change-password">
                      <li class="hover:text-emerald-400">Change Password</li>
                    </router-link>
                  </ul>
                </details>
              </li>
              <router-link to="/profile/orders">
                <li class="bg-gray-700 p-3 rounded-md hover:text-emerald-400">My Orders</li>
              </router-link>
            </ul>
          </div>
        </div>

        <!-- Right Column: Content Area (7/10 on Desktop, Full-width on Mobile) -->
        <div class="w-full md:w-7/10 bg-gray-700 p-6 rounded-lg shadow-lg">
          <router-view :user="user"></router-view>
        </div>
      </div>
    </div>

    <div v-else>
      <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      <p v-else class="text-white text-center">Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useUser } from '@/composables/user.composables'
import { useAuthStore } from '@/stores/authStore'

const user = ref(null)
const error = ref(null)
const auth = useAuthStore()
const { getUserData } = useUser()

onMounted(() => {
  console.log('User ID from Pinia:', auth.user?.id) // Debugging
})

// Watch for when the user ID becomes available
watch(
  () => auth.user?.id,
  async (newUserId) => {
    if (newUserId) {
      try {
        user.value = await getUserData(newUserId)
      } catch (err) {
        error.value = 'Failed to load user data.'
      }
    }
  },
  { immediate: true },
)
</script>
