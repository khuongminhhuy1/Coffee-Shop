<template>
  <div class="h-screen flex flex-row w-full">
    <div class="w-full flex flex-col">
      <!-- Header -->

      <AdminHeader />
      <!-- Main Content -->
      <div class="flex flex-grow h-full">
        <!-- Main Content Area -->
        <div class="flex-grow p-4">
          <router-view></router-view>
        </div>
      </div>

      <!-- Footer -->
      <AdminFooter />
    </div>
  </div>
</template>

<script setup>
import AdminFooter from '../common/admin/AdminFooter.vue'
import AdminHeader from '../common/admin/AdminHeader.vue'
</script>
