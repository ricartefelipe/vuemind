import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { i18n } from '@/app/i18n'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { useNotificationsStore } from '@/features/notifications/stores/notificationsStore'
import AppShell from './AppShell.vue'

const Pagina = { template: '<h1>Página</h1>' }

async function render() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore()
  auth.accessToken = 'token'
  auth.user = { id: 'user-1', name: 'Ana Lima', email: 'ana@example.com' }
  vi.spyOn(useNotificationsStore(), 'load').mockResolvedValue(undefined as never)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: ['dashboard', 'transactions', 'beneficiaries', 'transfer-pix', 'archive', 'notifications', 'settings', 'login'].map(
      (name) => ({ path: name === 'dashboard' ? '/' : `/${name}`, name, component: Pagina }),
    ),
  })
  await router.push('/transactions')
  await router.isReady()
  const wrapper = mount(AppShell, { attachTo: document.body, global: { plugins: [i18n, pinia, router] } })
  return { wrapper, router }
}

describe('AppShell', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('o botão de menu abre e fecha a navegação e informa o estado', async () => {
    const { wrapper } = await render()
    const toggle = wrapper.get('[data-testid="shell-nav-toggle"]')
    const nav = wrapper.get('nav')

    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(toggle.attributes('aria-controls')).toBe(nav.attributes('id'))
    expect(nav.classes()).not.toContain('app-shell__nav--open')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(nav.classes()).toContain('app-shell__nav--open')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('Esc fecha a navegação aberta e devolve o foco ao botão de menu', async () => {
    const { wrapper } = await render()
    const toggle = wrapper.get('[data-testid="shell-nav-toggle"]')
    await toggle.trigger('click')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()

    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle.element)
    wrapper.unmount()
  })

  it('trocar de página fecha a navegação', async () => {
    const { wrapper, router } = await render()
    const toggle = wrapper.get('[data-testid="shell-nav-toggle"]')
    await toggle.trigger('click')

    await router.push('/')
    await flushPromises()

    expect(toggle.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})
