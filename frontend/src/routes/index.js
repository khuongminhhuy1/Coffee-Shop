import ContentManagement from '@/views/admin/ContentManagement.vue'
import HomePage from '@/views/home/HomePage.vue'
import Login from '@/views/user/Login.vue'
import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/admin/Dashboard.vue'
import ShowUsers from '@/views/admin/user/ShowUsers.vue'
import UserRegister from '@/views/user/UserRegister.vue'
import UserProfile from '@/views/user/UserProfile.vue'
import UserInfo from '@/views/user/UserInfo.vue'
import ChangePassword from '@/components/form/ChangePassword.vue'
import ForgotPassword from '@/views/user/ForgotPassword.vue'
import ResetPassword from '@/views/user/ResetPassword.vue'
import UserAddress from '@/views/user/UserAddress.vue'
import SingleProductPage from '@/views/product/SingleProductPage.vue'
import CartPage from '@/views/cart/CartPage.vue'
import Checkout from '@/views/checkout/Checkout.vue'
import OrderedPage from '@/views/order/OrderedPage.vue'
import OrdersPage from '@/views/order/OrdersPage.vue'
import ShowCategories from '@/views/admin/category/ShowCategories.vue'

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
      path: '/register',
      name: 'register',
      component: UserRegister,
      meta: { noHeader: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: { noHeader: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword,
      meta: { noHeader: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: UserProfile,
      meta: { noHeader: false },
      children: [
        {
          path: '/profile/information',
          name: 'UserInfo',
          component: UserInfo,
          meta: { noHeader: false, layout: 'default' },
          props: (route) => ({ user: route.params.user }),
        },
        {
          path: '/profile/change-password',
          name: 'change-password',
          component: ChangePassword,
          meta: { noHeader: false, layout: 'default' },
          props: (route) => ({ user: route.params.user }),
        },
        {
          path: '/profile/address',
          name: 'user-address',
          component: UserAddress,
          meta: { noHeader: false, layout: 'default' },
          props: (route) => ({ user: route.params.user }),
        },
        {
          path: '/profile/orders',
          name: 'UserOrder',
          component: OrdersPage,
          meta: { noHeader: false, layout: 'default' },
          props: (route) => ({ user: route.params.user }),
        },
      ],
    },
    {
      path: '/products/:id',
      name: 'single-product',
      component: SingleProductPage,
      meta: { noHeader: false, layout: 'default' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage,
      meta: { noHeader: false, layout: 'default' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout,
      meta: { noHeader: false, layout: 'default' },
    },
    {
      path: '/order-confirmation',
      name: 'order-confirmation',
      component: OrderedPage,
      meta: { noHeader: false, layout: 'default' },
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
        {
          path: '/admin/categories',
          name: 'admin-categories',
          component: ShowCategories,
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
