import { afterEach, describe, expect, it, vi } from 'vitest'
import { authApi } from './authApi'

describe('authApi.login', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('valida no TotalRecall em modo remoto e cria a sessão local', async () => {
    vi.stubEnv('VITE_ENABLE_MSW', 'false')
    const fetch = vi.fn(async () => ({
      json: async () => ({
        valid: true,
        profile: { id: 'profile-1', name: 'Felipe', email: 'felipe@example.com' },
        system: { slug: 'vuemind', name: 'VueMind' },
        systems: [],
        expiresAt: '2026-08-01T12:00:00.000Z',
      }),
    }))
    vi.stubGlobal('fetch', fetch)

    await expect(authApi.login('felipe@example.com', 'senha')).resolves.toEqual({
      accessToken: 'totalrecall:profile-1',
      user: { id: 'profile-1', name: 'Felipe', email: 'felipe@example.com' },
    })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/login$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'felipe@example.com',
          password: 'senha',
          system: 'vuemind',
        }),
      }),
    )
  })

  it('expõe erro claro quando TotalRecall rejeita a senha', async () => {
    vi.stubEnv('VITE_ENABLE_MSW', 'false')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => ({ valid: false, reason: 'invalid_credentials' }),
      })),
    )

    await expect(authApi.login('felipe@example.com', 'incorreta')).rejects.toMatchObject({
      status: 401,
      message: 'Email ou senha inválidos.',
    })
  })
})
