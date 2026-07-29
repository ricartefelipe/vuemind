<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: { name: string; pixKey: string }]
}>()

const { t } = useI18n()
const name = ref('')
const pixKey = ref('')
const nameError = ref('')
const pixKeyError = ref('')

const canSubmit = computed(() => !props.loading)

function onSubmit(): void {
  nameError.value = name.value.trim() ? '' : t('beneficiaries.validation.name')
  pixKeyError.value = pixKey.value.trim() ? '' : t('beneficiaries.validation.pixKey')
  if (nameError.value || pixKeyError.value) return

  emit('submit', { name: name.value.trim(), pixKey: pixKey.value.trim() })
  name.value = ''
  pixKey.value = ''
}
</script>

<template>
  <form class="beneficiary-form" @submit.prevent="onSubmit">
    <AppInput
      id="beneficiary-name"
      v-model="name"
      :label="t('beneficiaries.form.name')"
      :error="nameError"
    />
    <AppInput
      id="beneficiary-pix"
      v-model="pixKey"
      :label="t('beneficiaries.form.pixKey')"
      :error="pixKeyError"
    />
    <AppButton type="submit" :disabled="!canSubmit">
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
</style>
