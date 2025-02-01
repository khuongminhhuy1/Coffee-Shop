import ContentManagement from '@/components/admin/ContentManagement.vue'
import HomePage from '@/components/home/HomePage.vue'
import Login from '@/components/user/Login.vue'
import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { noHeader: false },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { noHeader: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: ContentManagement,
      meta: { layout: 'admin', requiresAuth: true, requiresRole: 'ADMIN' },
    },
  ],
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // Ensure authentication before accessing protected routes

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('Checking auth:', authStore.isAuthenticated, authStore.user)
    return next('/')
  }
  // Ensure the user has the correct role
  if (to.meta.requiresRole && authStore.user?.role !== to.meta.requiresRole) {
    return next('/') // Redirect if role is not authorized
  }
  next()
})
export default router
