import { http } from '@/shared/http/client'
import type { TransactionFilters, TransactionsPage, WalletBalance } from '@/features/wallet/types'

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
  getBalance: (): Promise<WalletBalance> => http.get<WalletBalance>('/wallet/balance'),
  listTransactions: (filters: TransactionFilters): Promise<TransactionsPage> =>
    http.get<TransactionsPage>(`/wallet/transactions${buildTransactionsQuery(filters)}`),
}
