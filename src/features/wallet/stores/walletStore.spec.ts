import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWalletStore } from './walletStore'

vi.mock('@/features/wallet/api/walletApi', () => ({
  walletApi: {
    getBalance: vi.fn(async () => ({
      availableCents: 250000,
      blockedCents: 10000,
      dailyLimitCents: 100000,
      dailySpentCents: 0,
      currency: 'BRL',
    })),
    listTransactions: vi.fn(async () => ({
      items: [],
      page: 1,
      pageSize: 20,
      total: 0,
    })),
  },
}))

describe('useWalletStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('inicia sem saldo carregado', () => {
    const wallet = useWalletStore()

    expect(wallet.balanceCents).toBeNull()
    expect(wallet.balanceLoading).toBe(false)
    expect(wallet.balanceError).toBeNull()
    expect(wallet.transactions).toBeNull()
  })

  it('carrega o saldo via walletApi.getBalance', async () => {
    const wallet = useWalletStore()

    await wallet.loadBalance()

    expect(wallet.balanceCents).toBe(250000)
    expect(wallet.blockedCents).toBe(10000)
    expect(wallet.dailyLimitCents).toBe(100000)
    expect(wallet.currency).toBe('BRL')
    expect(wallet.balanceLoading).toBe(false)
  })

  it('registra o erro quando walletApi.getBalance falha', async () => {
    const { walletApi } = await import('@/features/wallet/api/walletApi')
    vi.mocked(walletApi.getBalance).mockRejectedValueOnce(new Error('offline'))
    const wallet = useWalletStore()

    await wallet.loadBalance()

    expect(wallet.balanceCents).toBeNull()
    expect(wallet.balanceError).toBeInstanceOf(Error)
  })

  it('carrega o extrato repassando os filtros atuais', async () => {
    const { walletApi } = await import('@/features/wallet/api/walletApi')
    const wallet = useWalletStore()
    wallet.filters.type = 'PIX_IN'
    wallet.filters.q = 'ana'

    await wallet.loadTransactions()

    expect(walletApi.listTransactions).toHaveBeenCalledWith({
      from: '',
      to: '',
      type: 'PIX_IN',
      q: 'ana',
      page: 1,
      pageSize: 20,
    })
    expect(wallet.transactions).toEqual([])
    expect(wallet.transactionsLoading).toBe(false)
  })

  it('carrega mais páginas acumulando itens', async () => {
    const { walletApi } = await import('@/features/wallet/api/walletApi')
    vi.mocked(walletApi.listTransactions)
      .mockResolvedValueOnce({
        items: [
          {
            id: 't1',
            type: 'PIX_IN',
            amountCents: 100,
            description: 'a',
            createdAt: '2026-08-01T00:00:00.000Z',
            counterparty: 'Ana',
          },
        ],
        page: 1,
        pageSize: 1,
        total: 2,
      })
      .mockResolvedValueOnce({
        items: [
          {
            id: 't2',
            type: 'PIX_OUT',
            amountCents: 200,
            description: 'b',
            createdAt: '2026-08-01T00:00:00.000Z',
            counterparty: 'Bruno',
          },
        ],
        page: 2,
        pageSize: 1,
        total: 2,
      })

    const wallet = useWalletStore()
    await wallet.loadTransactions()
    await wallet.loadMoreTransactions()

    expect(wallet.transactions?.map((item) => item.id)).toEqual(['t1', 't2'])
    expect(wallet.hasMore).toBe(false)
  })
})
