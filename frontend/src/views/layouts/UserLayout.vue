<template>
  <div
    class="flex flex-col min-h-screen bg-cover bg-[url(/images/wallpaper.png)] bg-center bg-fixed relative"
  >
    <!-- Sticky Header Section -->
    <Header class="sticky top-0 z-50 bg-white shadow-md" />

    <!-- Main Content Section -->
    <main class="p-4 w-full">
      <!-- Dimmer Overlay -->
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <!-- Dimmer overlay -->

      <div class="w-full flex flex-col justify-center items-center flex-grow relative z-10">
        <div class="w-10/12">
          <slot name="body"></slot>
        </div>
      </div>
    </main>

    <!-- Footer Section -->
    <Footer />
  </div>
</template>

<script>
import Header from '../common/user/Header.vue'
import Footer from '../common/user/Footer.vue'

export default {
  name: 'Layout',
  components: {
    Header,
    Footer,
  },
}
</script>
