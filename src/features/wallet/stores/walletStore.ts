/**
 * Store de "setup" (função, não `state`/`actions`) de propósito: é a forma
 * natural de reaproveitar `useAsyncState` — saldo e extrato são dois
 * carregamentos independentes (um pode falhar sem travar o outro), então
 * cada um ganha seu próprio `loading`/`error` em vez de um par único que
 * misturaria o estado das duas seções da tela.
 *
 * `filters` é `reactive` (não um `ref` de objeto) para a `TransactionsView`
 * poder fazer `v-model="filters.type"` direto, sem o `.value` no meio.
 */
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

  /**
   * `useAsyncState.run` relança o erro para quem chama poder reagir; aqui
   * ninguém precisa reagir além de deixar o próprio `error` reativo da
   * store contar a história para a UI, então o `catch` fica vazio de
   * propósito — não é erro engolido silenciosamente, é erro já registrado.
   */
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
