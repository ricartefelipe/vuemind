<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBeneficiariesStore } from '@/features/beneficiaries/stores/beneficiariesStore'
import { formatCents } from '@/shared/utils/money'
import AppButton from '@/shared/ui/AppButton.vue'

const props = defineProps<{
  beneficiaryId: string
  amountCents: number
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  back: []
}>()

const { t, locale } = useI18n()
const beneficiaries = useBeneficiariesStore()

const beneficiaryName = computed(() => {
  const found = (beneficiaries.items ?? []).find((b) => b.id === props.beneficiaryId)
  return found?.name ?? props.beneficiaryId
})

const amountLabel = computed(() => formatCents(props.amountCents, locale.value))
</script>

<template>
  <div class="transfer-confirm">
    <p>
      <strong>{{ t('transfers.confirm.to') }}:</strong> {{ beneficiaryName }}
    </p>
    <p>
      <strong>{{ t('transfers.confirm.amount') }}:</strong> {{ amountLabel }}
    </p>
    <div class="transfer-confirm__actions">
      <AppButton variant="secondary" :disabled="loading" @click="emit('back')">
        {{ t('common.cancel') }}
      </AppButton>
      <AppButton :disabled="loading" @click="emit('confirm')">
        {{ t('transfers.confirm.submit') }}
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

.transfer-confirm__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}
</style>
