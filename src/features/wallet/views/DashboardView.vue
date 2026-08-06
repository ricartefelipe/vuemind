<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWalletStore } from '@/features/wallet/stores/walletStore'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore'
import { useNotificationsStore } from '@/features/notifications/stores/notificationsStore'
import type { Transaction } from '@/features/wallet/types'
import BalanceCard from '@/features/wallet/components/BalanceCard.vue'
import OnboardingChecklist from '@/features/wallet/components/OnboardingChecklist.vue'
import Skeleton from '@/shared/ui/Skeleton.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import { formatCents } from '@/shared/utils/money'
import { ApiError } from '@/shared/http/errors'

const { t, locale } = useI18n()
const wallet = useWalletStore()
const auth = useAuthStore()
const onboarding = useOnboardingStore()
const notifications = useNotificationsStore()
const recent = ref<Transaction[]>([])
const recentLoading = ref(false)

onMounted(async () => {
  await Promise.all([wallet.loadBalance(), onboarding.load(), notifications.load()])
  recentLoading.value = true
  try {
    recent.value = await wallet.loadRecentTransactions(5)
    await onboarding.load()
  } finally {
    recentLoading.value = false
  }
})

function correlationFrom(error: Error | null): string | undefined {
  return error instanceof ApiError ? error.correlationId : undefined
}
</script>

<template>
  <section class="dashboard-view">
    <header class="dashboard-view__intro">
      <p class="dashboard-view__eyebrow">
        {{ t('wallet.greeting') }}{{ auth.user?.name ? `, ${auth.user.name.split(' ')[0]}` : '' }}
      </p>
      <h1 class="dashboard-view__title">{{ t('app.name') }}</h1>
    </header>

    <Skeleton v-if="wallet.balanceLoading || (wallet.balance === null && !wallet.balanceError)" />
    <ErrorBanner
      v-else-if="wallet.balanceError"
      :message="t('common.error')"
      :correlation-id="correlationFrom(wallet.balanceError)"
    >
      <template #action>
        <AppButton variant="secondary" @click="wallet.loadBalance()">{{ t('common.retry') }}</AppButton>
      </template>
    </ErrorBanner>
    <BalanceCard
      v-else-if="wallet.balance"
      :available-cents="wallet.balance.availableCents"
      :blocked-cents="wallet.balance.blockedCents"
      :daily-limit-cents="wallet.balance.dailyLimitCents"
      :daily-spent-cents="wallet.balance.dailySpentCents"
      :currency="wallet.balance.currency"
    />

    <OnboardingChecklist
      v-if="!onboarding.completed || onboarding.steps.length"
      :steps="onboarding.steps"
      :completed="onboarding.completed"
      :done-count="onboarding.doneCount"
    />

    <div class="dashboard-view__actions">
      <h2>{{ t('wallet.shortcutsTitle') }}</h2>
      <nav class="dashboard-view__shortcuts">
        <RouterLink :to="{ name: 'transfer-pix' }" class="dashboard-view__shortcut dashboard-view__shortcut--primary">
          <span class="dashboard-view__icon" aria-hidden="true">↗</span>
          <span>{{ t('nav.transferPix') }}</span>
        </RouterLink>
        <RouterLink :to="{ name: 'beneficiaries' }" class="dashboard-view__shortcut">
          <span class="dashboard-view__icon" aria-hidden="true">◎</span>
          <span>{{ t('nav.beneficiaries') }}</span>
        </RouterLink>
        <RouterLink :to="{ name: 'transactions' }" class="dashboard-view__shortcut">
          <span class="dashboard-view__icon" aria-hidden="true">≡</span>
          <span>{{ t('nav.transactions') }}</span>
        </RouterLink>
      </nav>
    </div>

    <section class="dashboard-view__recent">
      <h2>{{ t('wallet.recentTitle') }}</h2>
      <Skeleton v-if="recentLoading" :lines="4" />
      <ul v-else class="dashboard-view__list" data-testid="recent-transactions">
        <li v-for="tx in recent" :key="tx.id" class="dashboard-view__tx">
          <div>
            <strong>{{ tx.description }}</strong>
            <p>{{ tx.counterparty }}</p>
          </div>
          <span :class="{ 'dashboard-view__credit': tx.type === 'PIX_IN' }">
            {{ tx.type === 'PIX_IN' ? '+' : '-' }}{{ formatCents(tx.amountCents, locale) }}
          </span>
        </li>
      </ul>
    </section>
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

.dashboard-view__actions,
.dashboard-view__recent {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.dashboard-view__actions h2,
.dashboard-view__recent h2 {
  margin: 0;
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

.dashboard-view__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.dashboard-view__tx {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.dashboard-view__tx p {
  margin: 0.2rem 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.dashboard-view__tx span {
  color: var(--color-danger);
  font-family: var(--font-display);
  white-space: nowrap;
}

.dashboard-view__credit {
  color: var(--color-success) !important;
}

@media (max-width: 640px) {
  .dashboard-view__shortcuts {
    grid-template-columns: 1fr;
  }
}
</style>
