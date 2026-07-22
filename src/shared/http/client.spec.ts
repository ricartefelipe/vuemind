import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from './errors'
import { http, setAuthTokenAccessor } from './client'

describe('http client', () => {
  beforeEach(() => {
    setAuthTokenAccessor(() => 'token-demo')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ code: 'X', message: 'fail', correlationId: 'c1' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )
  })

  it('lança ApiError com correlationId do body', async () => {
    await expect(http.get('/wallet/balance')).rejects.toBeInstanceOf(ApiError)
    await expect(http.get('/wallet/balance')).rejects.toMatchObject({
      code: 'X',
      correlationId: 'c1',
      status: 400,
    })
  })

  it('envia Authorization e X-Correlation-Id', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    )
    await http.get('/wallet/balance')
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(init.headers.Authorization).toBe('Bearer token-demo')
    expect(init.headers['X-Correlation-Id']).toBeTruthy()
  })
})
