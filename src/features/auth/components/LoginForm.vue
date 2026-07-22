<script setup lang="ts">
/**
 * Puramente apresentacional: não conhece `authStore` nem `router`, só
 * emite `submit` com as credenciais e recebe `loading`/`error` de fora.
 * Essa separação deixa a `LoginView` (que fala com a store) livre para
 * mudar de estratégia de auth sem tocar em HTML/validação do formulário.
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'

defineProps<{
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
    <p v-if="error" class="login-form__error" role="alert">{{ error }}</p>
    <AppButton type="submit" :disabled="loading">{{ t('login.submit') }}</AppButton>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 360px;
}

.login-form__error {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-danger);
}
</style>
