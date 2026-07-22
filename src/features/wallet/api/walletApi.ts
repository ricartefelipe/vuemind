/**
 * Única porta de entrada para dados da carteira: a `walletStore` não sabe
 * que o extrato é `GET /wallet/transactions?from&to&type` — só chama
 * `walletApi.listTransactions(filters)` e recebe a lista já tipada.
 *
 * `type: 'ALL'` não vira query param: para o backend (e o mock), "todos os
 * tipos" é a ausência do filtro, não um valor `ALL` que ele precisaria
 * entender e ignorar.
 */
import { http } from '@/shared/http/client'
import type { TransactionFilters, TransactionsResponse, WalletBalance } from '@/features/wallet/types'

function buildTransactionsQuery(filters: TransactionFilters): string {
  const params = new URLSearchParams()
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.type !== 'ALL') params.set('type', filters.type)

  const query = params.toString()
  return query ? `?${query}` : ''
}

export const walletApi = {
  getBalance: (): Promise<WalletBalance> => http.get<WalletBalance>('/wallet/balance'),
  listTransactions: (filters: TransactionFilters): Promise<TransactionsResponse> =>
    http.get<TransactionsResponse>(`/wallet/transactions${buildTransactionsQuery(filters)}`),
}
