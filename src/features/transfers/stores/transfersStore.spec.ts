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
      endToEndId: 'E123',
      correlationId: 'c-receipt',
    })),
    getById: vi.fn(),
    getQrPayload: vi.fn(async () => ({ payload: 'MINDPIX|v1|ana@email.com|1000' })),
  },
}))

vi.mock('@/shared/utils/id', () => ({
  createIdempotencyKey: vi.fn(() => 'idem-fixed'),
}))

describe('useTransfersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('caminho feliz: confirm avança para receipt', async () => {
    const store = useTransfersStore()
    store.setDestination({ mode: 'beneficiary', beneficiaryId: 'b1' })
    store.setAmount(1000)
    store.skipSchedule()

    await store.confirmPix()

    expect(store.step).toBe('receipt')
    expect(store.lastReceipt?.id).toBe('tr1')
    expect(store.idempotencyKey).toBe('idem-fixed')
  })

  it('reusa Idempotency-Key no retry', async () => {
    const { transfersApi } = await import('@/features/transfers/api/transfersApi')
    vi.mocked(transfersApi.createPix)
      .mockRejectedValueOnce(new ApiError(409, 'INSUFFICIENT_FUNDS', 'Saldo insuficiente', 'c1'))
      .mockResolvedValueOnce({
        id: 'tr1',
        beneficiaryId: 'b1',
        amountCents: 1000,
        status: 'COMPLETED',
        createdAt: '2026-07-22T12:00:00.000Z',
        endToEndId: 'E123',
        correlationId: 'c-receipt',
      })

    const store = useTransfersStore()
    store.setDestination({ mode: 'beneficiary', beneficiaryId: 'b1' })
    store.setAmount(1000)
    store.skipSchedule()

    await store.confirmPix()
    await store.confirmPix()

    expect(transfersApi.createPix).toHaveBeenCalledTimes(2)
    expect(vi.mocked(transfersApi.createPix).mock.calls[0]?.[1]).toBe('idem-fixed')
    expect(vi.mocked(transfersApi.createPix).mock.calls[1]?.[1]).toBe('idem-fixed')
    expect(store.step).toBe('receipt')
  })

  it('saldo insuficiente: permanece em confirm com erro', async () => {
    const { transfersApi } = await import('@/features/transfers/api/transfersApi')
    vi.mocked(transfersApi.createPix).mockRejectedValueOnce(
      new ApiError(409, 'INSUFFICIENT_FUNDS', 'Saldo insuficiente', 'c1'),
    )
    const store = useTransfersStore()
    store.setDestination({ mode: 'beneficiary', beneficiaryId: 'b1' })
    store.setAmount(999999)
    store.skipSchedule()

    await store.confirmPix()

    expect(store.step).toBe('confirm')
    expect(store.error).toBeInstanceOf(ApiError)
    expect((store.error as ApiError).code).toBe('INSUFFICIENT_FUNDS')
  })
})
