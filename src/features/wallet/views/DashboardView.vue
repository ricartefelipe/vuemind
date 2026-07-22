<script setup lang="ts">
/**
 * Única tela que dispara `loadBalance()` — o extrato tem sua própria
 * (`TransactionsView`) porque são dados independentes e a Dashboard não
 * precisa pagar o custo de carregar transações que talvez o usuário nunca
 * veja nesta visita.
 */
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWalletStore } from '@/features/wallet/stores/walletStore'
import BalanceCard from '@/features/wallet/components/BalanceCard.vue'
import LoadingBlock from '@/shared/ui/LoadingBlock.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const { t } = useI18n()
const wallet = useWalletStore()

onMounted(() => {
  wallet.loadBalance()
})
</script>

<template>
  <section class="dashboard-view">
    <LoadingBlock v-if="wallet.balanceLoading" :label="t('common.loading')" />
    <ErrorBanner v-else-if="wallet.balanceError" :message="t('common.error')">
      <template #action>
        <AppButton variant="secondary" @click="wallet.loadBalance()">{{ t('common.retry') }}</AppButton>
      </template>
    </ErrorBanner>
    <BalanceCard v-else-if="wallet.balanceCents !== null" :cents="wallet.balanceCents" :currency="wallet.currency" />

    <nav class="dashboard-view__shortcuts">
      <RouterLink :to="{ name: 'transfer-pix' }" class="dashboard-view__shortcut">
        {{ t('nav.transferPix') }}
      </RouterLink>
      <RouterLink :to="{ name: 'transactions' }" class="dashboard-view__shortcut">
        {{ t('nav.transactions') }}
      </RouterLink>
      <RouterLink :to="{ name: 'beneficiaries' }" class="dashboard-view__shortcut">
        {{ t('nav.beneficiaries') }}
      </RouterLink>
    </nav>
  </section>
</template>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.dashboard-view__shortcuts {
  display: flex;
  gap: var(--space-3);
}

.dashboard-view__shortcut {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  transition:
    border-color 0.15s ease,
    color 0.15s ease;
}

.dashboard-view__shortcut:hover {
  border-color: var(--color-primary);
  color: var(--color-primary-strong);
}
</style>
