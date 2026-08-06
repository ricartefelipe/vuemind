<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { applyTheme } from '@/app/theme/applyTheme'
import { useSettingsStore, type Locale, type Theme } from '@/features/settings/stores/settingsStore'
import { useAuthStore } from '@/features/auth/stores/authStore'
import AppButton from '@/shared/ui/AppButton.vue'

const { t, locale } = useI18n()
const settings = useSettingsStore()
const auth = useAuthStore()
const router = useRouter()

function selectTheme(theme: Theme): void {
  settings.setTheme(theme)
  applyTheme(theme)
}

function selectLocale(next: Locale): void {
  settings.setLocale(next)
  locale.value = next
}

async function handleLogout(): Promise<void> {
  auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <section class="settings-view">
    <h1>{{ t('settings.title') }}</h1>

    <fieldset class="settings-view__group">
      <legend>{{ t('settings.theme') }}</legend>
      <AppButton
        :variant="settings.theme === 'light' ? 'primary' : 'secondary'"
        @click="selectTheme('light')"
      >
        {{ t('settings.themeLight') }}
      </AppButton>
      <AppButton
        :variant="settings.theme === 'dark' ? 'primary' : 'secondary'"
        @click="selectTheme('dark')"
      >
        {{ t('settings.themeDark') }}
      </AppButton>
    </fieldset>

    <fieldset class="settings-view__group">
      <legend>{{ t('settings.locale') }}</legend>
      <AppButton
        :variant="settings.locale === 'pt-BR' ? 'primary' : 'secondary'"
        @click="selectLocale('pt-BR')"
      >
        {{ t('settings.localePtBr') }}
      </AppButton>
      <AppButton
        :variant="settings.locale === 'en' ? 'primary' : 'secondary'"
        @click="selectLocale('en')"
      >
        {{ t('settings.localeEn') }}
      </AppButton>
    </fieldset>

    <fieldset class="settings-view__group">
      <legend>{{ t('nav.logout') }}</legend>
      <AppButton variant="secondary" data-testid="settings-logout" @click="handleLogout">
        {{ t('settings.logout') }}
      </AppButton>
    </fieldset>
  </section>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.settings-view__group {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin: 0;
}

.settings-view__group legend {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  padding: 0 var(--space-2);
}
</style>
