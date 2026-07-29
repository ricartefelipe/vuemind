<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWalletStore } from '@/features/wallet/stores/walletStore'
import { useAuthStore } from '@/features/auth/stores/authStore'
import BalanceCard from '@/features/wallet/components/BalanceCard.vue'
import LoadingBlock from '@/shared/ui/LoadingBlock.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const { t } = useI18n()
const wallet = useWalletStore()
const auth = useAuthStore()

onMounted(() => {
  wallet.loadBalance()
})
</script>

<template>
  <section class="dashboard-view">
    <header class="dashboard-view__intro">
      <p class="dashboard-view__eyebrow">{{ t('wallet.greeting') }}{{ auth.user?.name ? `, ${auth.user.name.split(' ')[0]}` : '' }}</p>
      <h1 class="dashboard-view__title">{{ t('app.name') }}</h1>
    </header>

    <LoadingBlock
      v-if="wallet.balanceLoading || (wallet.balanceCents === null && !wallet.balanceError)"
      :label="t('common.loading')"
    />
    <ErrorBanner v-else-if="wallet.balanceError" :message="t('common.error')">
      <template #action>
        <AppButton variant="secondary" @click="wallet.loadBalance()">{{ t('common.retry') }}</AppButton>
      </template>
    </ErrorBanner>
    <BalanceCard v-else-if="wallet.balanceCents !== null" :cents="wallet.balanceCents" :currency="wallet.currency" />

    <div class="dashboard-view__actions">
      <h2>{{ t('wallet.shortcutsTitle') }}</h2>
      <nav class="dashboard-view__shortcuts">
        <RouterLink :to="{ name: 'transfer-pix' }" class="dashboard-view__shortcut dashboard-view__shortcut--primary">
          <span class="dashboard-view__icon" aria-hidden="true">↗</span>
          <span>{{ t('nav.transferPix') }}</span>
        </RouterLink>
        <RouterLink :to="{ name: 'transactions' }" class="dashboard-view__shortcut">
          <span class="dashboard-view__icon" aria-hidden="true">≡</span>
          <span>{{ t('nav.transactions') }}</span>
        </RouterLink>
        <RouterLink :to="{ name: 'beneficiaries' }" class="dashboard-view__shortcut">
          <span class="dashboard-view__icon" aria-hidden="true">◎</span>
          <span>{{ t('nav.beneficiaries') }}</span>
        </RouterLink>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.dashboard-view__eyebrow {
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 500;
}

.dashboard-view__title {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  color: var(--color-primary-strong);
}

.dashboard-view__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.dashboard-view__actions h2 {
  font-size: var(--font-size-lg);
  color: var(--color-text);
}

.dashboard-view__shortcuts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
}

.dashboard-view__shortcut {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-height: 120px;
  padding: var(--space-4);
  text-decoration: none;
  color: var(--color-text);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--motion-fast), border-color var(--motion-fast), box-shadow var(--motion-fast);
}

.dashboard-view__shortcut:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--color-accent) 55%, var(--color-border));
  box-shadow: var(--shadow-md);
}

.dashboard-view__shortcut--primary {
  background: linear-gradient(160deg, var(--color-accent-soft), var(--color-surface-elevated));
  border-color: color-mix(in srgb, var(--color-accent) 40%, var(--color-border));
}

.dashboard-view__icon {
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  font-size: 1rem;
}

.dashboard-view__shortcut span:last-child {
  font-weight: 600;
  font-size: var(--font-size-sm);
}

@media (max-width: 640px) {
  .dashboard-view__shortcuts {
    grid-template-columns: 1fr;
  }
}
</style>
