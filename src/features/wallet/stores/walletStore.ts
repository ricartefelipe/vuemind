import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import { walletApi } from '@/features/wallet/api/walletApi'
import { useAsyncState } from '@/shared/composables/useAsyncState'
import type { Transaction, TransactionFilters, WalletBalance } from '@/features/wallet/types'

export const useWalletStore = defineStore('wallet', () => {
  const balanceState = useAsyncState<WalletBalance>()
  const transactionsState = useAsyncState<Transaction[]>()

  const filters = reactive<TransactionFilters>({
    from: '',
    to: '',
    type: 'ALL',
  })

  const balanceCents = computed(() => balanceState.data.value?.availableCents ?? null)
  const currency = computed(() => balanceState.data.value?.currency ?? 'BRL')
  const transactions = computed(() => transactionsState.data.value)

  async function loadBalance(): Promise<void> {
    try {
      await balanceState.run(() => walletApi.getBalance())
    } catch {
      /* já registrado em balanceState.error */
    }
  }

  async function loadTransactions(): Promise<void> {
    try {
      await transactionsState.run(async () => (await walletApi.listTransactions(filters)).items)
    } catch {
      /* já registrado em transactionsState.error */
    }
  }

  return {
    balanceCents,
    currency,
    balanceLoading: balanceState.loading,
    balanceError: balanceState.error,
    transactions,
    transactionsLoading: transactionsState.loading,
    transactionsError: transactionsState.error,
    filters,
    loadBalance,
    loadTransactions,
  }
})
