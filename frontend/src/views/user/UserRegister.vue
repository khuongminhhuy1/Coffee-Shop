<template>
  <div
    class="font-[sans-serif] bg-amber-600 bg-cover"
    :style="{ backgroundImage: `url(${backgroundImg})` }"
  >
    <div class="min-h-screen flex flex-col items-center justify-center">
      <div
        class="grid md:grid-cols-2 items-center backdrop-blur-sm bg-opacity-50 gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-lg rounded-md"
      >
        <div class="md:max-w-md w-full px-4 py-4">
          <form @submit.prevent="register">
            <div class="mb-12">
              <h3 class="text-white text-3xl font-extrabold uppercase">Register</h3>
              <p class="text-sm mt-4 text-white">
                Already have an account?
                <router-link to="/login" class="text-amber-600 font-semibold hover:underline ml-1"
                  >Login here</router-link
                >
              </p>
            </div>

            <!-- Name Field -->
            <div>
              <label class="text-white text-xs block mb-2 font-extrabold">Name</label>
              <input
                type="text"
                v-model="data.name"
                required
                class="w-full bg-white rounded-md text-emerald-800 text-sm border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter Your Name"
              />
            </div>

            <!-- Email Field -->
            <div class="mt-4">
              <label class="text-white text-xs block mb-2 font-extrabold">Email</label>
              <input
                type="email"
                v-model="data.email"
                required
                class="w-full bg-white rounded-md text-emerald-800 text-sm border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter Email"
              />
            </div>

            <!-- Password Field -->
            <div class="mt-4">
              <label class="text-white text-xs block mb-2 font-extrabold">Password</label>
              <input
                type="password"
                v-model="data.password"
                required
                class="w-full bg-white rounded-md text-emerald-800 text-sm border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter Password"
              />
              <p
                v-if="data.password.length > 0 && data.password.length < 6"
                class="text-red-500 text-sm"
              >
                Password must be at least 6 characters
              </p>
            </div>

            <!-- Confirm Password Field -->
            <div class="mt-4">
              <label class="text-white text-xs block mb-2 font-extrabold">Confirm Password</label>
              <input
                type="password"
                v-model="data.confirmPassword"
                required
                class="w-full bg-white rounded-md text-emerald-800 text-sm border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Confirm Password"
              />
              <p
                v-if="data.password !== data.confirmPassword && data.confirmPassword.length > 0"
                class="text-red-500 text-sm"
              >
                Passwords do not match
              </p>
            </div>

            <!-- Terms & Conditions -->
            <div class="mt-4 flex flex-row items-center">
              <input type="checkbox" v-model="data.isTermsAccepted" class="checkbox mr-4" />
              <p class="text-white">I accept the <a href="#">Terms of Service</a></p>
            </div>

            <!-- Error Message -->
            <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

            <!-- Register Button -->
            <div class="mt-6">
              <button
                type="submit"
                class="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md font-bold bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="
                  !data.isTermsAccepted ||
                  !data.name ||
                  !data.email ||
                  !data.password ||
                  data.password.length < 6 ||
                  data.password !== data.confirmPassword ||
                  loading
                "
              >
                <span v-if="loading">Registering...</span>
                <span v-else>Register</span>
              </button>
            </div>
          </form>
        </div>

        <div class="md:h-full bg-amber-700 bg-cover rounded-xl lg:p-12 p-8 text-right"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import backgroundImg from '@/assets/bg/noHeader-bg.jpg'

const auth = useAuth()
const router = useRouter()
const errorMessage = ref('')
const loading = ref(false)

const data = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  isTermsAccepted: false,
})

// ✅ Reset error message when user starts typing again
watch(
  [
    () => data.value.name,
    () => data.value.email,
    () => data.value.password,
    () => data.value.confirmPassword,
  ],
  () => {
    errorMessage.value = ''
  },
)

const register = async () => {
  if (!data.value.name || !data.value.email || !data.value.password) {
    errorMessage.value = 'All fields are required'
    return
  }

  if (data.value.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }

  if (data.value.password !== data.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  try {
    loading.value = true
    const response = await auth.register(data.value.name, data.value.email, data.value.password)
    console.log('Registration successful:', response.data)
    errorMessage.value = ''
    router.push('/login') // ✅ Redirect to login after successful registration
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
