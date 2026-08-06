<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { parseReaisToCents } from '@/shared/utils/money'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const emit = defineEmits<{
  submit: [amountCents: number]
  back: []
}>()

const { t } = useI18n()
const amount = ref('')
const amountError = ref('')

function onSubmit(): void {
  amountError.value = ''
  let cents = 0
  try {
    cents = parseReaisToCents(amount.value)
    if (cents <= 0) throw new Error('INVALID_MONEY')
  } catch {
    amountError.value = t('transfers.validation.amount')
    return
  }
  emit('submit', cents)
}
</script>

<template>
  <form class="transfer-step" data-testid="pix-amount" @submit.prevent="onSubmit">
    <h2>{{ t('transfers.steps.amount') }}</h2>
    <AppInput
      id="pix-amount"
      v-model="amount"
      :label="t('transfers.form.amount')"
      :error="amountError"
    />
    <div class="transfer-step__actions">
      <AppButton variant="secondary" type="button" @click="emit('back')">{{ t('common.back') }}</AppButton>
      <AppButton type="submit" data-testid="pix-amount-continue">{{ t('transfers.form.continue') }}</AppButton>
    </div>
  </form>
</template>

<style scoped>
.transfer-step {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.transfer-step h2 {
  margin: 0;
  font-size: var(--font-size-lg);
}

.transfer-step__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
</style>
