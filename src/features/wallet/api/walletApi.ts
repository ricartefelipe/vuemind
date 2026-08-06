import { http } from '@/shared/http/client'
import type { TransactionFilters, TransactionsPage, WalletBalance } from '@/features/wallet/types'
import {
  normalizeTransactionsPage,
  normalizeWalletBalance,
} from '@/features/wallet/api/normalizeWallet'

function buildTransactionsQuery(filters: TransactionFilters): string {
  const params = new URLSearchParams()
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.type !== 'ALL') params.set('type', filters.type)
  if (filters.q.trim()) params.set('q', filters.q.trim())
  params.set('page', String(filters.page))
  params.set('pageSize', String(filters.pageSize))

  const query = params.toString()
  return query ? `?${query}` : ''
}

export const walletApi = {
  getBalance: async (): Promise<WalletBalance> =>
    normalizeWalletBalance(await http.get<Partial<WalletBalance>>('/wallet/balance')),
  listTransactions: async (filters: TransactionFilters): Promise<TransactionsPage> =>
    normalizeTransactionsPage(
      await http.get<Partial<TransactionsPage>>(
        `/wallet/transactions${buildTransactionsQuery(filters)}`,
      ),
      filters.page,
      filters.pageSize,
    ),
}
