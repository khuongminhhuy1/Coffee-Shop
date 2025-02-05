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
import AdminFooter from '../common/admin/AdminFooter.vue';
import AdminHeader from '../common/admin/AdminHeader.vue';

export default {
  name: 'AdminLayout',
  components: { AdminHeader, AdminFooter },
}
</script>
