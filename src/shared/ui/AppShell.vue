<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/features/auth/stores/authStore'
import AppButton from '@/shared/ui/AppButton.vue'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()

async function handleLogout(): Promise<void> {
  auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--auth': !auth.isAuthenticated }">
    <header v-if="auth.isAuthenticated" class="app-shell__header">
      <RouterLink :to="{ name: 'dashboard' }" class="app-shell__brand">
        <span class="app-shell__mark" aria-hidden="true" />
        <span>{{ t('app.name') }}</span>
      </RouterLink>
      <nav class="app-shell__nav" aria-label="Principal">
        <RouterLink :to="{ name: 'dashboard' }" class="app-shell__link">{{ t('nav.dashboard') }}</RouterLink>
        <RouterLink :to="{ name: 'transactions' }" class="app-shell__link">{{ t('nav.transactions') }}</RouterLink>
        <RouterLink :to="{ name: 'transfer-pix' }" class="app-shell__link">{{ t('nav.transferPix') }}</RouterLink>
        <RouterLink :to="{ name: 'beneficiaries' }" class="app-shell__link">{{ t('nav.beneficiaries') }}</RouterLink>
        <RouterLink :to="{ name: 'settings' }" class="app-shell__link">{{ t('nav.settings') }}</RouterLink>
        <AppButton variant="ghost" @click="handleLogout">{{ t('nav.logout') }}</AppButton>
      </nav>
    </header>
    <main class="app-shell__content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-shell--auth .app-shell__content {
  max-width: none;
  padding: 0;
  margin: 0;
}

.app-shell__header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  background: color-mix(in srgb, var(--color-surface-elevated) 86%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  backdrop-filter: blur(14px);
}

.app-shell__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  color: var(--color-primary-strong);
  text-decoration: none;
}

.app-shell__mark {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 25%, transparent);
}

.app-shell__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-1) var(--space-3);
}

.app-shell__link {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  transition: color var(--motion-fast), background var(--motion-fast);
}

.app-shell__link:hover {
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.app-shell__link.router-link-active {
  color: var(--color-primary-strong);
  background: var(--color-primary-soft);
}

.app-shell__content {
  flex: 1;
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5) var(--space-7);
}

@media (max-width: 720px) {
  .app-shell__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .app-shell__nav {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
