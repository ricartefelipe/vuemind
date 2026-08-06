import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/authStore'
import LoginView from '@/features/auth/views/LoginView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/features/wallet/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/features/wallet/views/TransactionsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/beneficiaries',
    name: 'beneficiaries',
    component: () => import('@/features/beneficiaries/views/BeneficiariesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transfer-pix',
    name: 'transfer-pix',
    component: () => import('@/features/transfers/views/TransferPixView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/features/notifications/views/NotificationsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/features/settings/views/SettingsView.vue'),
    meta: { requiresAuth: true },
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login' }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'dashboard' }
})
