import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './authStore'

vi.mock('@/features/auth/api/authApi', () => ({
  authApi: {
    login: vi.fn(async () => ({
      accessToken: 'tok',
      user: { id: 'u1', name: 'Marion', email: 'demo@vuemind.dev' },
    })),
  },
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia deslogada', () => {
    const auth = useAuthStore()

    expect(auth.isAuthenticated).toBe(false)
    expect(auth.accessToken).toBeNull()
    expect(auth.user).toBeNull()
  })

  it('guarda token após login', async () => {
    const auth = useAuthStore()

    await auth.login('demo@vuemind.dev', 'demo123')

    expect(auth.isAuthenticated).toBe(true)
    expect(auth.accessToken).toBe('tok')
    expect(auth.user?.email).toBe('demo@vuemind.dev')
  })

  it('logout limpa token e usuário', async () => {
    const auth = useAuthStore()
    await auth.login('demo@vuemind.dev', 'demo123')

    auth.logout()

    expect(auth.isAuthenticated).toBe(false)
    expect(auth.accessToken).toBeNull()
    expect(auth.user).toBeNull()
  })
})
