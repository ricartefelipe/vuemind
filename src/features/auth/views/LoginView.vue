<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { ApiError } from '@/shared/http/errors'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const email = ref('demo@vuemind.dev')
const password = ref('demo123')
const loading = ref(false)
const error = ref('')

async function handleSubmit(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    await router.push({ name: 'dashboard' })
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : t('common.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login-hero">
    <div class="login-hero__brand">
      <p class="login-hero__eyebrow">Carteira digital</p>
      <h1 class="login-hero__title">{{ t('login.title') }}</h1>
      <p class="login-hero__subtitle">{{ t('login.subtitle') }}</p>
    </div>
    <div class="login-hero__panel">
      <form class="login-form" @submit.prevent="handleSubmit">
        <label>
          <span>{{ t('login.email') }}</span>
          <input v-model="email" type="email" autocomplete="username" />
        </label>
        <label>
          <span>{{ t('login.password') }}</span>
          <input v-model="password" type="password" autocomplete="current-password" />
        </label>
        <p v-if="error" class="login-form__error" role="alert">{{ error }}</p>
        <button type="submit" :disabled="loading">{{ t('login.submit') }}</button>
      </form>
      <p class="login-hero__hint">{{ t('login.hint') }}</p>
    </div>
  </section>
</template>

<style scoped>
.login-hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  background: radial-gradient(ellipse at 20% 20%, #1a3f38, #071a17 55%);
  color: #f7faf8;
}
.login-hero__brand,
.login-hero__panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 6vw, 5rem);
}
.login-hero__panel {
  background: rgba(4, 17, 14, 0.55);
  border-left: 1px solid rgba(224, 194, 122, 0.28);
}
.login-hero__eyebrow {
  margin: 0 0 12px;
  font-size: 0.8125rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #e0c27a;
  font-weight: 600;
}
.login-hero__title {
  font-size: clamp(2.75rem, 6vw, 4.5rem);
  margin: 0 0 16px;
}
.login-hero__subtitle {
  margin: 0;
  max-width: 28ch;
  font-size: 1.125rem;
  color: rgba(247, 250, 248, 0.78);
}
.login-hero__hint {
  margin: 16px 0 0;
  font-size: 0.8125rem;
  color: #e0c27a;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 380px;
}
.login-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.875rem;
  color: rgba(247, 250, 248, 0.7);
}
.login-form input {
  min-height: 2.85rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(224, 194, 122, 0.35);
  background: rgba(10, 31, 27, 0.7);
  color: #f7faf8;
  font: inherit;
}
.login-form button {
  min-height: 3rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #e0c27a, #b8923f);
  color: #10241f;
  font-weight: 600;
  font: inherit;
  cursor: pointer;
}
.login-form button:disabled { opacity: 0.6; cursor: not-allowed; }
.login-form__error { margin: 0; color: #ffb4a8; font-size: 0.875rem; }
@media (max-width: 860px) {
  .login-hero { grid-template-columns: 1fr; }
  .login-hero__panel { border-left: none; border-top: 1px solid rgba(224, 194, 122, 0.28); }
}
</style>
