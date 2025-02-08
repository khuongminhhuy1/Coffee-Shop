import ContentManagement from '@/views/admin/ContentManagement.vue'
import HomePage from '@/views/home/HomePage.vue'
import Login from '@/views/user/Login.vue'
import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/admin/Dashboard.vue'
import ShowUsers from '@/views/admin/user/ShowUsers.vue'

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
      children: [
        {
          path: '/admin/dashboard',
          name: 'dashboard',
          component: Dashboard,
          meta: { layout: 'admin', requiresAuth: true, requiresRole: 'ADMIN' },
        },
        {
          path: '/admin/users',
          name: 'admin-users',
          component: ShowUsers,
          meta: { layout: 'admin', requiresAuth: true, requiresRole: 'ADMIN' },
        },
      ],
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
