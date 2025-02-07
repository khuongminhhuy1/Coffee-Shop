<template>
  <main class="flex-grow w-full">
    <!-- Hero Section (First Section) -->
    <div class="flex flex-col justify-center items-center h-screen px-4 text-white text-center">
      <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl">
        Welcome to
        <span
          class="bg-gradient-to-l from-amber-600 via-amber-700 to-amber-900 text-transparent bg-clip-text"
        >
          Coffeel
        </span>
      </h1>
      <p class="pt-8 sm:pt-10 text-lg max-w-3xl mx-auto">
        The best place to buy coffee and tea online. We have a wide selection of coffee beans, tea
        leaves, and brewing equipment.
      </p>
    </div>

    <!-- Info Section -->
    <div class="w-full mx-auto"></div>
    <AboutUs />

    <div class="w-full flex justify-center items-center">
      <ProductPresentation />
    </div>

    <div class=""></div>
  </main>
</template>

<script>
import AboutUs from '@/components/homepage/AboutUs.vue'
import ProductPresentation from '@/components/homepage/ProductPresentation.vue'
export default {
  name: 'HomePage',
  components: {
    AboutUs,
    ProductPresentation,
  },
}
</script>
