<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBeneficiariesStore } from '@/features/beneficiaries/stores/beneficiariesStore'
import type { PixDestination } from '@/features/transfers/types'
import type { PixKeyType } from '@/features/beneficiaries/types'
import { isValidPixKey } from '@/shared/utils/pixKey'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const emit = defineEmits<{
  submit: [payload: PixDestination]
}>()

const { t } = useI18n()
const beneficiaries = useBeneficiariesStore()
const beneficiaryId = ref('')
const pixKey = ref('')
const pixKeyType = ref<PixKeyType>('EMAIL')
const error = ref('')
const pixKeyTypes: PixKeyType[] = ['EMAIL', 'CPF', 'PHONE', 'RANDOM']

onMounted(() => {
  if (beneficiaries.items === null) beneficiaries.load()
})

function onSubmit(): void {
  const hasBeneficiary = Boolean(beneficiaryId.value)
  const hasKey = Boolean(pixKey.value.trim())
  if (hasBeneficiary === hasKey) {
    error.value = hasBeneficiary ? t('transfers.validation.xor') : t('transfers.validation.beneficiary')
    return
  }
  if (hasKey && !isValidPixKey(pixKeyType.value, pixKey.value.trim())) {
    error.value = t('transfers.validation.pixKey')
    return
  }
  error.value = ''
  if (hasBeneficiary) {
    emit('submit', { mode: 'beneficiary', beneficiaryId: beneficiaryId.value })
    return
  }
  emit('submit', {
    mode: 'key',
    pixKey: pixKey.value.trim(),
    pixKeyType: pixKeyType.value,
  })
}
</script>

<template>
  <form class="transfer-step" data-testid="pix-destination" @submit.prevent="onSubmit">
    <h2>{{ t('transfers.steps.destination') }}</h2>
    <label class="transfer-step__label" for="pix-beneficiary">
      {{ t('transfers.form.beneficiary') }}
    </label>
    <select
      id="pix-beneficiary"
      v-model="beneficiaryId"
      class="transfer-step__select"
      data-testid="pix-beneficiary"
      @change="pixKey = ''"
    >
      <option value="">{{ t('transfers.form.chooseBeneficiary') }}</option>
      <option v-for="item in beneficiaries.items ?? []" :key="item.id" :value="item.id">
        {{ item.name }} — {{ item.pixKey }}
      </option>
    </select>

    <p class="transfer-step__or">{{ t('transfers.form.orKey') }}</p>

    <label class="transfer-step__label" for="pix-key-type">
      {{ t('transfers.form.pixKeyType') }}
    </label>
    <select id="pix-key-type" v-model="pixKeyType" class="transfer-step__select" :disabled="Boolean(beneficiaryId)">
      <option v-for="type in pixKeyTypes" :key="type" :value="type">
        {{ t(`beneficiaries.types.${type}`) }}
      </option>
    </select>

    <AppInput
      id="pix-key"
      v-model="pixKey"
      :label="t('transfers.form.pixKey')"
      :disabled="Boolean(beneficiaryId)"
      @update:model-value="beneficiaryId = ''"
    />

    <p v-if="error" class="transfer-step__error">{{ error }}</p>
    <AppButton type="submit" data-testid="pix-destination-continue">
      {{ t('transfers.form.continue') }}
    </AppButton>
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

.transfer-step__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.transfer-step__select {
  font-family: var(--font-ui);
  font-size: var(--font-size-md);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.75rem;
}

.transfer-step__or {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.transfer-step__error {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-danger);
}
</style>
