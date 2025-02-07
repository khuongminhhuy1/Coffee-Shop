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
import Layout from './components/layouts/UserLayout.vue'
import AdminLayout from './components/layouts/AdminLayout.vue'
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAdmin } from '@/composables/admin.composables'

const admin = useAdmin()

onMounted(() => {
  //auth.register('buiquang', 'buiquang050398@gmail.com', '123456')
})

const route = useRoute()
const layout = computed(() => route.meta.layout || 'default')
const noHeader = computed(() => route.meta.noHeader)
</script>

<style scoped>
.btn {
  background-color: red;
  padding: 10px 20px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}
</style>
