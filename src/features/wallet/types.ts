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
  blockedCents: Cents
  dailyLimitCents: Cents
  dailySpentCents: Cents
  currency: string
}

export type TransactionFilters = {
  from: string
  to: string
  type: TransactionTypeFilter
  q: string
  page: number
  pageSize: number
}

export type TransactionsPage = {
  items: Transaction[]
  page: number
  pageSize: number
  total: number
}
