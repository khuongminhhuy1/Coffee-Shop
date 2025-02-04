<template>
  <div>
    <div v-if="layout === 'admin'" class="min-h-screen">
      <AdminLayout>
        <template #body>
          <RouterView />
        </template>
      </AdminLayout>
    </div>
    <div v-else>
      <div v-if="noHeader" class="min-h-screen">
        <RouterView />
      </div>
      <div v-else class="min-h-screen">
        <Layout>
          <template #body>
            <RouterView />
          </template>
        </Layout>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import Layout from './views/layouts/UserLayout.vue'
import AdminLayout from './views/layouts/AdminLayout.vue'
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})

const route = useRoute()
const layout = computed(() => route.meta.layout || 'default')
const noHeader = computed(() => route.meta.noHeader)
</script>
