<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import type { PixTransfer } from '@/features/transfers/types'
import { useBeneficiariesStore } from '@/features/beneficiaries/stores/beneficiariesStore'
import { formatCents } from '@/shared/utils/money'
import AppButton from '@/shared/ui/AppButton.vue'

const props = defineProps<{
  receipt: PixTransfer
}>()

const emit = defineEmits<{
  again: []
}>()

const { t, locale } = useI18n()
const beneficiaries = useBeneficiariesStore()

const destinationLabel = computed(() => {
  if (props.receipt.beneficiaryId) {
    const found = (beneficiaries.items ?? []).find((item) => item.id === props.receipt.beneficiaryId)
    return found?.name ?? props.receipt.beneficiaryId
  }
  return props.receipt.pixKey ?? ''
})
</script>

<template>
  <div class="transfer-receipt" data-testid="pix-receipt">
    <h2>{{ t('transfers.receipt.title') }}</h2>
    <p><strong>{{ t('transfers.receipt.id') }}:</strong> {{ receipt.id }}</p>
    <p><strong>{{ t('transfers.confirm.to') }}:</strong> {{ destinationLabel }}</p>
    <p>
      <strong>{{ t('transfers.confirm.amount') }}:</strong>
      {{ formatCents(receipt.amountCents, locale) }}
    </p>
    <p>
      <strong>{{ t('transfers.receipt.status') }}:</strong>
      {{ t(`transfers.status.${receipt.status}`) }}
    </p>
    <p>
      <strong>{{ t('transfers.receipt.endToEnd') }}:</strong>
      <span data-testid="pix-end-to-end">{{ receipt.endToEndId }}</span>
    </p>
    <p>
      <strong>{{ t('transfers.receipt.when') }}:</strong>
      {{ new Date(receipt.createdAt).toLocaleString(locale) }}
    </p>
    <p v-if="receipt.scheduledFor">
      <strong>{{ t('transfers.receipt.scheduledFor') }}:</strong>
      {{ new Date(receipt.scheduledFor).toLocaleString(locale) }}
    </p>
    <p>
      <strong>{{ t('transfers.receipt.correlationId') }}:</strong>
      {{ receipt.correlationId }}
    </p>
    <div class="transfer-receipt__actions">
      <AppButton variant="secondary" @click="emit('again')">{{ t('transfers.receipt.again') }}</AppButton>
      <RouterLink :to="{ name: 'transactions' }">
        <AppButton>{{ t('nav.transactions') }}</AppButton>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.transfer-receipt {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.transfer-receipt h2 {
  margin: 0 0 var(--space-2);
  font-family: var(--font-display);
}

.transfer-receipt__actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-3);
}
</style>
