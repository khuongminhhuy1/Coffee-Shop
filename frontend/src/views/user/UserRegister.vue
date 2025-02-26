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

            <div class="mt-4">
              <label class="text-white text-xs block mb-2 font-extrabold">Password</label>
              <input
                type="password"
                v-model="data.password"
                required
                class="w-full bg-white rounded-md text-emerald-800 text-sm border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter Password"
              />
            </div>

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
                v-if="data.password !== data.confirmPassword && data.attemptedSubmit"
                class="text-red-500 text-sm"
              >
                Passwords do not match
              </p>
            </div>

            <div class="mt-4 flex flex-row items-center">
              <input type="checkbox" v-model="data.isTermsAccepted" class="checkbox mr-4" />
              <p class="text-white">I accept the <a href="#">Terms of Service</a></p>
            </div>

            <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

            <div class="mt-6">
              <button
                type="submit"
                class="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md font-bold bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br"
                :disabled="
                  !data.isTermsAccepted ||
                  !data.name ||
                  !data.email ||
                  !data.password ||
                  data.password !== data.confirmPassword
                "
              >
                Register
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
import { ref } from 'vue'
import backgroundImg from '@/assets/bg/noHeader-bg.jpg'

const auth = useAuth()
const errorMessage = ref('')

const data = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  isTermsAccepted: false,
  attemptedSubmit: false,
})

const register = async () => {
  data.value.attemptedSubmit = true

  if (!data.value.name || !data.value.email || !data.value.password) {
    errorMessage.value = 'All fields are required'
    return
  }

  if (data.value.password !== data.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  try {
    const response = await auth.register(data.value.name, data.value.email, data.value.password)
    console.log('Registration successful:', response.data)
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed'
  }
}
</script>
