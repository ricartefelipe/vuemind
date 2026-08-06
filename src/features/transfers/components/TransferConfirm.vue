<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBeneficiariesStore } from '@/features/beneficiaries/stores/beneficiariesStore'
import type { CreatePixInput } from '@/features/transfers/types'
import { formatCents } from '@/shared/utils/money'
import AppButton from '@/shared/ui/AppButton.vue'

const props = defineProps<{
  draft: CreatePixInput
  loading?: boolean
  hasError?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  back: []
}>()

const { t, locale } = useI18n()
const beneficiaries = useBeneficiariesStore()

const destinationLabel = computed(() => {
  if (props.draft.beneficiaryId) {
    const found = (beneficiaries.items ?? []).find((item) => item.id === props.draft.beneficiaryId)
    return found?.name ?? props.draft.beneficiaryId
  }
  return props.draft.pixKey ?? ''
})

const amountLabel = computed(() => formatCents(props.draft.amountCents, locale.value))
const whenLabel = computed(() =>
  props.draft.scheduledFor
    ? new Date(props.draft.scheduledFor).toLocaleString(locale.value)
    : t('transfers.confirm.now'),
)
</script>

<template>
  <div class="transfer-confirm" data-testid="pix-confirm">
    <h2>{{ t('transfers.steps.confirm') }}</h2>
    <p>
      <strong>{{ t('transfers.confirm.to') }}:</strong> {{ destinationLabel }}
    </p>
    <p>
      <strong>{{ t('transfers.confirm.amount') }}:</strong> {{ amountLabel }}
    </p>
    <p>
      <strong>{{ t('transfers.confirm.when') }}:</strong> {{ whenLabel }}
    </p>
    <div class="transfer-confirm__actions">
      <AppButton variant="secondary" :disabled="loading" @click="emit('back')">
        {{ t('common.back') }}
      </AppButton>
      <AppButton :disabled="loading" data-testid="pix-confirm-submit" @click="emit('confirm')">
        {{ hasError ? t('transfers.confirm.retry') : t('transfers.confirm.submit') }}
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.transfer-confirm {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.transfer-confirm h2 {
  margin: 0;
  font-size: var(--font-size-lg);
}

.transfer-confirm__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}
</style>
