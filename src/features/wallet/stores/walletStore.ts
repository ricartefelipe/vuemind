import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { walletApi } from '@/features/wallet/api/walletApi'
import { useAsyncState } from '@/shared/composables/useAsyncState'
import type { Transaction, TransactionFilters, WalletBalance } from '@/features/wallet/types'

const DEFAULT_PAGE_SIZE = 20

export const useWalletStore = defineStore('wallet', () => {
  const balanceState = useAsyncState<WalletBalance>()
  const transactions = ref<Transaction[] | null>(null)
  const transactionsLoading = ref(false)
  const transactionsLoadingMore = ref(false)
  const transactionsError = ref<Error | null>(null)
  const page = ref(1)
  const pageSize = ref(DEFAULT_PAGE_SIZE)
  const total = ref(0)

  const filters = reactive<Omit<TransactionFilters, 'page' | 'pageSize'>>({
    from: '',
    to: '',
    type: 'ALL',
    q: '',
  })

  const balance = computed(() => balanceState.data.value)
  const balanceCents = computed(() => balanceState.data.value?.availableCents ?? null)
  const blockedCents = computed(() => balanceState.data.value?.blockedCents ?? null)
  const dailyLimitCents = computed(() => balanceState.data.value?.dailyLimitCents ?? null)
  const dailySpentCents = computed(() => balanceState.data.value?.dailySpentCents ?? null)
  const currency = computed(() => balanceState.data.value?.currency ?? 'BRL')
  const hasMore = computed(() => (transactions.value?.length ?? 0) < total.value)

  function currentFilters(nextPage: number): TransactionFilters {
    return {
      from: filters.from,
      to: filters.to,
      type: filters.type,
      q: filters.q,
      page: nextPage,
      pageSize: pageSize.value,
    }
  }

  async function loadBalance(): Promise<void> {
    try {
      await balanceState.run(() => walletApi.getBalance())
    } catch {
    }
  }

  async function loadTransactions(): Promise<void> {
    transactionsLoading.value = true
    transactionsError.value = null
    page.value = 1
    try {
      const response = await walletApi.listTransactions(currentFilters(1))
      transactions.value = response.items
      page.value = response.page
      pageSize.value = response.pageSize
      total.value = response.total
    } catch (err) {
      transactionsError.value = err as Error
      transactions.value = null
    } finally {
      transactionsLoading.value = false
    }
  }

  async function loadMoreTransactions(): Promise<void> {
    if (!hasMore.value || transactionsLoadingMore.value) return
    transactionsLoadingMore.value = true
    transactionsError.value = null
    try {
      const nextPage = page.value + 1
      const response = await walletApi.listTransactions(currentFilters(nextPage))
      transactions.value = [...(transactions.value ?? []), ...response.items]
      page.value = response.page
      pageSize.value = response.pageSize
      total.value = response.total
    } catch (err) {
      transactionsError.value = err as Error
    } finally {
      transactionsLoadingMore.value = false
    }
  }

  async function loadRecentTransactions(limit = 5): Promise<Transaction[]> {
    const response = await walletApi.listTransactions({
      from: '',
      to: '',
      type: 'ALL',
      q: '',
      page: 1,
      pageSize: limit,
    })
    return response.items
  }

  return {
    balance,
    balanceCents,
    blockedCents,
    dailyLimitCents,
    dailySpentCents,
    currency,
    balanceLoading: balanceState.loading,
    balanceError: balanceState.error,
    transactions,
    transactionsLoading,
    transactionsLoadingMore,
    transactionsError,
    total,
    hasMore,
    filters,
    loadBalance,
    loadTransactions,
    loadMoreTransactions,
    loadRecentTransactions,
  }
})
