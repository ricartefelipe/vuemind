<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import type { CreateBeneficiaryInput, PixKeyType } from '@/features/beneficiaries/types'
import { isValidPixKey } from '@/shared/utils/pixKey'

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: CreateBeneficiaryInput]
}>()

const { t } = useI18n()
const name = ref('')
const pixKey = ref('')
const pixKeyType = ref<PixKeyType>('EMAIL')
const nameError = ref('')
const pixKeyError = ref('')

const pixKeyTypes: PixKeyType[] = ['EMAIL', 'CPF', 'PHONE', 'RANDOM']
const canSubmit = computed(() => !props.loading)

function onSubmit(): void {
  nameError.value = name.value.trim() ? '' : t('beneficiaries.validation.name')
  if (!pixKey.value.trim()) {
    pixKeyError.value = t('beneficiaries.validation.pixKey')
  } else if (!isValidPixKey(pixKeyType.value, pixKey.value.trim())) {
    pixKeyError.value = t('beneficiaries.validation.pixKeyInvalid')
  } else {
    pixKeyError.value = ''
  }
  if (nameError.value || pixKeyError.value) return

  emit('submit', {
    name: name.value.trim(),
    pixKey: pixKey.value.trim(),
    pixKeyType: pixKeyType.value,
  })
  name.value = ''
  pixKey.value = ''
  pixKeyType.value = 'EMAIL'
}
</script>

<template>
  <form class="beneficiary-form" data-testid="beneficiary-form" @submit.prevent="onSubmit">
    <AppInput
      id="beneficiary-name"
      v-model="name"
      :label="t('beneficiaries.form.name')"
      :error="nameError"
    />
    <label class="beneficiary-form__label" for="beneficiary-type">
      {{ t('beneficiaries.form.pixKeyType') }}
    </label>
    <select id="beneficiary-type" v-model="pixKeyType" class="beneficiary-form__select" data-testid="beneficiary-type">
      <option v-for="type in pixKeyTypes" :key="type" :value="type">
        {{ t(`beneficiaries.types.${type}`) }}
      </option>
    </select>
    <AppInput
      id="beneficiary-pix"
      v-model="pixKey"
      :label="t('beneficiaries.form.pixKey')"
      :error="pixKeyError"
    />
    <AppButton type="submit" :disabled="!canSubmit" data-testid="beneficiary-submit">
      {{ t('beneficiaries.form.submit') }}
    </AppButton>
  </form>
</template>

<style scoped>
.beneficiary-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.beneficiary-form__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.beneficiary-form__select {
  font-family: var(--font-ui);
  font-size: var(--font-size-md);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.75rem;
}
</style>
