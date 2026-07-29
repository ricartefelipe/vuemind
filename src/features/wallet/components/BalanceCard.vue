<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatCents } from '@/shared/utils/money'

const props = defineProps<{
  cents: number
  currency: string
}>()

const { t, locale } = useI18n()

const formatted = computed(() => formatCents(props.cents, locale.value, props.currency))
</script>

<template>
  <div class="balance-card">
    <div class="balance-card__glow" aria-hidden="true" />
    <span class="balance-card__label">{{ t('wallet.balance') }}</span>
    <span class="balance-card__value">{{ formatted }}</span>
  </div>
</template>

<style scoped>
.balance-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
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

.balance-card__label {
  position: relative;
  font-size: var(--font-size-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  color: color-mix(in srgb, var(--color-accent) 80%, white);
}

.balance-card__value {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 7vw, 3.6rem);
  letter-spacing: -0.03em;
  line-height: 1;
}
</style>
