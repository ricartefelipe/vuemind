/**
 * Contrato da carteira: mock (`walletHandlers`) e o futuro backend Spring
 * respondem exatamente nesses formatos — `TransactionTypeFilter` inclui
 * `'ALL'` (só existe do lado do filtro, nunca vem gravado numa transação
 * real) para o extrato poder pedir "sem filtro de tipo" sem um `type`
 * opcional espalhando `undefined` pela UI inteira.
 */
import type { Cents } from '@/shared/types/money'

export type TransactionType = 'PIX_OUT' | 'PIX_IN' | 'TED'
export type TransactionTypeFilter = 'ALL' | TransactionType

export type Transaction = {
  id: string
  type: TransactionType
  amountCents: Cents
  description: string
  createdAt: string
  counterparty: string
}

export type WalletBalance = {
  availableCents: Cents
  currency: string
}

export type TransactionFilters = {
  from: string
  to: string
  type: TransactionTypeFilter
}

export type TransactionsResponse = {
  items: Transaction[]
}
