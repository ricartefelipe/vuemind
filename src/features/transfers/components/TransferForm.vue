<script setup lang="ts">
/**
 * Passo 1 do PIX: escolhe favorecido + valor em reais.
 * Converte para centavos com `parseReaisToCents` antes de emitir.
 */
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBeneficiariesStore } from '@/features/beneficiaries/stores/beneficiariesStore'
import { parseReaisToCents } from '@/shared/utils/money'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const emit = defineEmits<{
  submit: [payload: { beneficiaryId: string; amountCents: number }]
}>()

const { t } = useI18n()
const beneficiaries = useBeneficiariesStore()

const beneficiaryId = ref('')
const amount = ref('')
const amountError = ref('')
const beneficiaryError = ref('')

onMounted(() => {
  if (beneficiaries.items === null) beneficiaries.load()
})

function onSubmit(): void {
  beneficiaryError.value = beneficiaryId.value ? '' : t('transfers.validation.beneficiary')
  amountError.value = ''
  let cents = 0
  try {
    cents = parseReaisToCents(amount.value)
    if (cents <= 0) throw new Error('INVALID_MONEY')
  } catch {
    amountError.value = t('transfers.validation.amount')
  }
  if (beneficiaryError.value || amountError.value) return

  emit('submit', { beneficiaryId: beneficiaryId.value, amountCents: cents })
}
</script>

<template>
  <form class="transfer-form" @submit.prevent="onSubmit">
    <label class="transfer-form__label" for="pix-beneficiary">
      {{ t('transfers.form.beneficiary') }}
    </label>
    <select id="pix-beneficiary" v-model="beneficiaryId" class="transfer-form__select">
      <option disabled value="">{{ t('transfers.form.chooseBeneficiary') }}</option>
      <option v-for="item in beneficiaries.items ?? []" :key="item.id" :value="item.id">
        {{ item.name }} — {{ item.pixKey }}
      </option>
    </select>
    <p v-if="beneficiaryError" class="transfer-form__error">{{ beneficiaryError }}</p>

    <AppInput
      id="pix-amount"
      v-model="amount"
      :label="t('transfers.form.amount')"
      :error="amountError"
    />

    <AppButton type="submit">{{ t('transfers.form.continue') }}</AppButton>
  </form>
</template>

<style scoped>
.transfer-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.transfer-form__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.transfer-form__select {
  font-family: var(--font-ui);
  font-size: var(--font-size-md);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.75rem;
}

.transfer-form__error {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-danger);
}
</style>
