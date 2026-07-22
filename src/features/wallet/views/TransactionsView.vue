<script setup lang="ts">
/**
 * Filtros (`from`/`to`/`type`) moram direto em `wallet.filters` — como é
 * `reactive` na store, o `v-model` aqui já edita o mesmo objeto que
 * `loadTransactions()` envia para a API, sem estado local duplicado nesta
 * view. O recarregamento só acontece no clique de "Filtrar", não a cada
 * tecla: evita disparar uma requisição por caractere digitado na data.
 */
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWalletStore } from '@/features/wallet/stores/walletStore'
import type { TransactionTypeFilter } from '@/features/wallet/types'
import { formatCents } from '@/shared/utils/money'
import LoadingBlock from '@/shared/ui/LoadingBlock.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const { t, locale } = useI18n()
const wallet = useWalletStore()

const typeOptions: TransactionTypeFilter[] = ['ALL', 'PIX_OUT', 'PIX_IN', 'TED']

const dateFormatter = computed(() => new Intl.DateTimeFormat(locale.value))

function formatDate(iso: string): string {
  return dateFormatter.value.format(new Date(iso))
}

function signedAmount(cents: number, isCredit: boolean): string {
  const formatted = formatCents(cents, locale.value)
  return isCredit ? `+${formatted}` : `-${formatted}`
}

onMounted(() => {
  wallet.loadTransactions()
})
</script>

<template>
  <section class="transactions-view">
    <h1>{{ t('wallet.transactions') }}</h1>

    <form class="transactions-view__filters" @submit.prevent="wallet.loadTransactions()">
      <label class="transactions-view__field">
        <span>{{ t('wallet.filters.from') }}</span>
        <input v-model="wallet.filters.from" type="date" />
      </label>
      <label class="transactions-view__field">
        <span>{{ t('wallet.filters.to') }}</span>
        <input v-model="wallet.filters.to" type="date" />
      </label>
      <label class="transactions-view__field">
        <span>{{ t('wallet.filters.type') }}</span>
        <select v-model="wallet.filters.type">
          <option v-for="option in typeOptions" :key="option" :value="option">
            {{ t(`wallet.types.${option}`) }}
          </option>
        </select>
      </label>
      <AppButton type="submit">{{ t('wallet.filters.apply') }}</AppButton>
    </form>

    <LoadingBlock
      v-if="wallet.transactionsLoading || (wallet.transactions === null && !wallet.transactionsError)"
      :label="t('common.loading')"
    />
    <ErrorBanner v-else-if="wallet.transactionsError" :message="t('common.error')">
      <template #action>
        <AppButton variant="secondary" @click="wallet.loadTransactions()">{{ t('common.retry') }}</AppButton>
      </template>
    </ErrorBanner>
    <EmptyState
      v-else-if="wallet.transactions.length === 0"
      :title="t('wallet.empty.title')"
      :description="t('wallet.empty.description')"
    />
    <ul v-else class="transactions-view__list">
      <li v-for="transaction in wallet.transactions" :key="transaction.id" class="transactions-view__item">
        <div class="transactions-view__info">
          <span class="transactions-view__description">{{ transaction.description }}</span>
          <span class="transactions-view__meta">
            {{ transaction.counterparty }} · {{ formatDate(transaction.createdAt) }}
          </span>
        </div>
        <span
          class="transactions-view__amount"
          :class="{ 'transactions-view__amount--credit': transaction.type === 'PIX_IN' }"
        >
          {{ signedAmount(transaction.amountCents, transaction.type === 'PIX_IN') }}
        </span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.transactions-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.transactions-view__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: var(--space-3);
}

.transactions-view__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.transactions-view__field input,
.transactions-view__field select {
  font-family: var(--font-ui);
  font-size: var(--font-size-md);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.75rem;
}

.transactions-view__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.transactions-view__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.transactions-view__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.transactions-view__description {
  color: var(--color-text);
  font-weight: 500;
}

.transactions-view__meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.transactions-view__amount {
  font-family: var(--font-display);
  font-size: var(--font-size-md);
  color: var(--color-danger);
  white-space: nowrap;
}

.transactions-view__amount--credit {
  color: var(--color-success);
}
</style>
