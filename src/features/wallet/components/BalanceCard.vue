<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatCents, toCents } from '@/shared/utils/money'

const props = defineProps<{
  availableCents: number
  blockedCents: number
  dailyLimitCents: number
  dailySpentCents: number
  currency: string
}>()

const { t, locale } = useI18n()

const available = computed(() => formatCents(props.availableCents, locale.value, props.currency))
const blocked = computed(() => formatCents(props.blockedCents, locale.value, props.currency))
const spent = computed(() => formatCents(props.dailySpentCents, locale.value, props.currency))
const limit = computed(() => formatCents(props.dailyLimitCents, locale.value, props.currency))
const limitPercent = computed(() => {
  const dailyLimit = toCents(props.dailyLimitCents)
  const dailySpent = toCents(props.dailySpentCents)
  if (dailyLimit <= 0) return 0
  return Math.min(100, Math.round((dailySpent / dailyLimit) * 100))
})
</script>

<template>
  <div class="balance-card" data-testid="balance-card">
    <div class="balance-card__glow" aria-hidden="true" />
    <div class="balance-card__primary">
      <span class="balance-card__label">{{ t('wallet.balance') }}</span>
      <span class="balance-card__value" data-testid="available-balance">{{ available }}</span>
    </div>
    <div class="balance-card__meta">
      <div>
        <span class="balance-card__meta-label">{{ t('wallet.blocked') }}</span>
        <span data-testid="blocked-balance">{{ blocked }}</span>
      </div>
      <div>
        <span class="balance-card__meta-label">{{ t('wallet.dailySpent') }}</span>
        <span>{{ spent }}</span>
      </div>
    </div>
    <div class="balance-card__limit" data-testid="daily-limit-bar">
      <div class="balance-card__limit-head">
        <span>{{ t('wallet.dailyLimit') }}</span>
        <span>{{ spent }} / {{ limit }}</span>
      </div>
      <div class="balance-card__track" role="progressbar" :aria-valuenow="limitPercent" aria-valuemin="0" aria-valuemax="100">
        <div class="balance-card__fill" :style="{ width: `${limitPercent}%` }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.balance-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: var(--radius-xl);
  background:
    linear-gradient(
      145deg,
      var(--color-primary) 0%,
      var(--color-primary-strong) 55%,
      var(--color-hero-deep) 100%
    );
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-glow);
}

.balance-card__glow {
  position: absolute;
  width: 220px;
  height: 220px;
  right: -40px;
  top: -60px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--color-accent) 55%, transparent), transparent 68%);
}

.balance-card__primary,
.balance-card__meta,
.balance-card__limit {
  position: relative;
}

.balance-card__label,
.balance-card__meta-label {
  display: block;
  font-size: var(--font-size-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  color: color-mix(in srgb, var(--color-accent) 80%, white);
  margin-bottom: 0.35rem;
}

.balance-card__value {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 7vw, 3.6rem);
  letter-spacing: -0.03em;
  line-height: 1;
}

.balance-card__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
}

.balance-card__limit-head {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
  margin-bottom: 0.5rem;
}

.balance-card__track {
  height: 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, white 22%, transparent);
  overflow: hidden;
}

.balance-card__fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-accent), white);
  transition: width var(--motion-fast);
}
</style>
