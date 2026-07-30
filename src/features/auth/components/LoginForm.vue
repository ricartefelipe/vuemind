<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const props = defineProps<{
  loading?: boolean
  error?: string
}>()

const emit = defineEmits<{
  submit: [email: string, password: string]
}>()

const { t } = useI18n()
const email = ref('')
const password = ref('')

function handleSubmit(): void {
  emit('submit', email.value, password.value)
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <AppInput id="login-email" v-model="email" type="email" :label="t('login.email')" />
    <AppInput id="login-password" v-model="password" type="password" :label="t('login.password')" />
    <p v-if="props.error" class="login-form__error" role="alert">{{ props.error }}</p>
    <AppButton type="submit" :disabled="props.loading">{{ t('login.submit') }}</AppButton>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 380px;
}

.login-form__error {
  margin: 0;
  font-size: 0.875rem;
  color: #ffb4a8;
}
</style>
