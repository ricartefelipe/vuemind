import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWalletStore } from './walletStore'

vi.mock('@/features/wallet/api/walletApi', () => ({
  walletApi: {
    getBalance: vi.fn(async () => ({ availableCents: 250000, currency: 'BRL' })),
    listTransactions: vi.fn(async () => ({ items: [] })),
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

    await wallet.loadTransactions()

    expect(walletApi.listTransactions).toHaveBeenCalledWith(wallet.filters)
    expect(wallet.transactions).toEqual([])
    expect(wallet.transactionsLoading).toBe(false)
  })
})
