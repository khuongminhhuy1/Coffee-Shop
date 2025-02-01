<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <AdminHeader />

    <!-- Main Content -->
    <div class="flex flex-grow h-full">
      <!-- Sidebar -->
      <!-- Main Content Area -->
      <div class="flex-grow p-4">
        <router-view></router-view>
      </div>
    </div>

    <!-- Footer -->
    <AdminFooter />
  </div>
</template>

<script>
import AdminHeader from '@/views/common/admin/AdminHeader.vue'
import AdminFooter from '@/views/common/admin/AdminFooter.vue'

export default {
  name: 'AdminLayout',
  components: { AdminHeader, AdminFooter },
}
</script>
