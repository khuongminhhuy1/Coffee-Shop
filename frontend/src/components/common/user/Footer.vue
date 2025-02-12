<template>
  <footer class="bg-gray-900 text-white py-8">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Company Info -->
        <div>
          <h2 class="text-xl font-bold">My Company</h2>
          <p class="mt-2 text-gray-400">Building amazing digital experiences. Connect with us!</p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold">Quick Links</h3>
          <ul class="mt-2 space-y-2">
            <li><router-link to="/" class="hover:text-gray-300">Home</router-link></li>
            <li><router-link to="/" class="hover:text-gray-300">About Us</router-link></li>
            <li><router-link to="/" class="hover:text-gray-300">Services</router-link></li>
            <li><router-link to="/" class="hover:text-gray-300">Contact</router-link></li>
          </ul>
        </div>

        <!-- Social Media -->
        <div>
          <h3 class="text-lg font-semibold">Follow Us</h3>
          <div class="mt-2 flex space-x-4">
            <a href="#" class="hover:text-gray-400"><i class="fab fa-facebook"></i></a>
            <a href="#" class="hover:text-gray-400"><i class="fab fa-twitter"></i></a>
            <a href="#" class="hover:text-gray-400"><i class="fab fa-instagram"></i></a>
            <a href="#" class="hover:text-gray-400"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-6 text-center text-gray-400 text-sm">
        &copy; {{ new Date().getFullYear() }} My Company. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script needed, just a simple footer.
</script>
