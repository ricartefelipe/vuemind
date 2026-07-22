/**
 * Router completo do app: rotas nomeadas (usadas por `RouterLink`,
 * `router.push({ name })` e pelo guard) e a proteção de autenticação —
 * único lugar que decide quem pode ver o quê. PIX e favorecidos ainda são
 * placeholders textuais; cada Task seguinte troca só o `component` da
 * rota por uma view real, sem tocar no guard.
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/features/auth/stores/authStore'

declare module 'vue-router' {
  interface RouteMeta {
    /** Rotas sem essa flag (ex.: `/login`) são acessíveis sem sessão. */
    requiresAuth?: boolean
  }
}

/** Fábrica de placeholder textual — evita repetir o boilerplate de `defineComponent` por rota. */
function placeholder(labelKey: string) {
  return defineComponent({
    name: 'RoutePlaceholder',
    setup() {
      const { t } = useI18n()
      return () => h('p', t(labelKey))
    },
  })
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/views/LoginView.vue'),
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
    path: '/transfer-pix',
    name: 'transfer-pix',
    component: placeholder('nav.transferPix'),
    meta: { requiresAuth: true },
  },
  {
    path: '/beneficiaries',
    name: 'beneficiaries',
    component: placeholder('nav.beneficiaries'),
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
  history: createWebHistory(),
  routes,
})

/**
 * Guard global: sem token tentando entrar numa rota `requiresAuth` volta
 * pro `/login`; já logado tentando ver o `/login` vai direto pro
 * `dashboard` — evita a UX de um usuário autenticado cair de novo no
 * formulário de senha (ex.: voltar no histórico do navegador).
 */
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login' }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'dashboard' }
})
