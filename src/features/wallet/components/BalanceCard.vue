<script setup lang="ts">
/**
 * Puramente apresentacional (mesma separação da `LoginForm`): não conhece
 * `walletStore` nem `settingsStore`, só recebe centavos + moeda + locale
 * já resolvidos e formata. Isso permite reutilizar o cartão em qualquer
 * tela futura (ex.: um resumo na home) sem duplicar a leitura das stores.
 */
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
    <span class="balance-card__label">{{ t('wallet.balance') }}</span>
    <span class="balance-card__value">{{ formatted }}</span>
  </div>
</template>

<style scoped>
.balance-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  background-color: var(--color-primary-soft);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}

.balance-card__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.balance-card__value {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  color: var(--color-primary-strong);
}
</style>
