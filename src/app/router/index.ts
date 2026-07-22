/**
 * Router mínimo deste marco: só o suficiente para o AppShell ter uma
 * navegação real e a SettingsView uma rota própria. Guards de autenticação
 * e as telas de saldo/extrato/PIX entram nas próximas tasks — a rota "/"
 * por enquanto é só um placeholder textual.
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'

const HomePlaceholder = defineComponent({
  name: 'HomePlaceholder',
  setup() {
    const { t } = useI18n()
    return () => h('p', t('app.name'))
  },
})

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePlaceholder },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/features/settings/views/SettingsView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
