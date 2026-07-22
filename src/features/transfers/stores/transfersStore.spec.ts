import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTransfersStore } from './transfersStore'
import { ApiError } from '@/shared/http/errors'

vi.mock('@/features/transfers/api/transfersApi', () => ({
  transfersApi: {
    createPix: vi.fn(async () => ({
      id: 'tr1',
      beneficiaryId: 'b1',
      amountCents: 1000,
      status: 'COMPLETED',
      createdAt: '2026-07-22T12:00:00.000Z',
    })),
    getById: vi.fn(),
  },
}))

describe('useTransfersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('caminho feliz: confirm avança para receipt', async () => {
    const store = useTransfersStore()
    store.setDraft({ beneficiaryId: 'b1', amountCents: 1000 })

    await store.confirmPix()

    expect(store.step).toBe('receipt')
    expect(store.lastReceipt?.id).toBe('tr1')
  })

  it('saldo insuficiente: permanece em confirm com erro', async () => {
    const { transfersApi } = await import('@/features/transfers/api/transfersApi')
    vi.mocked(transfersApi.createPix).mockRejectedValueOnce(
      new ApiError(409, 'INSUFFICIENT_FUNDS', 'Saldo insuficiente', 'c1'),
    )
    const store = useTransfersStore()
    store.setDraft({ beneficiaryId: 'b1', amountCents: 999999 })

    await store.confirmPix()

    expect(store.step).toBe('confirm')
    expect(store.error).toBeInstanceOf(ApiError)
    expect((store.error as ApiError).code).toBe('INSUFFICIENT_FUNDS')
  })
})
