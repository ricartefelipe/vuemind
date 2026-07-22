<script setup lang="ts">
/**
 * Único ponto da feature que conhece `authStore` + `router`: traduz o
 * `ApiError` de credenciais inválidas (código `INVALID_CREDENTIALS` do
 * mock) numa mensagem exibida no formulário, e decide para onde navegar
 * após o login — de propósito fora do guard, para não haver ambiguidade
 * sobre "quem manda pra onde depois de logar".
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { ApiError } from '@/shared/http/errors'
import LoginForm from '@/features/auth/components/LoginForm.vue'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const error = ref('')

async function handleSubmit(email: string, password: string): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    await auth.login(email, password)
    await router.push({ name: 'dashboard' })
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : t('common.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login-view">
    <h1>{{ t('login.title') }}</h1>
    <LoginForm :loading="loading" :error="error" @submit="handleSubmit" />
  </section>
</template>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  padding-top: var(--space-6);
}
</style>
