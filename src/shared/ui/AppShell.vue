<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { useNotificationsStore } from '@/features/notifications/stores/notificationsStore'

const { t } = useI18n()
const auth = useAuthStore()
const notifications = useNotificationsStore()

const initials = computed(() => {
  const name = auth.user?.name?.trim() ?? ''
  if (!name) return '?'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
})

onMounted(() => {
  if (auth.isAuthenticated) notifications.load()
})

watch(
  () => auth.isAuthenticated,
  (authenticated) => {
    if (authenticated) notifications.load()
  },
)
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
        <RouterLink :to="{ name: 'beneficiaries' }" class="app-shell__link">{{ t('nav.beneficiaries') }}</RouterLink>
        <RouterLink :to="{ name: 'transfer-pix' }" class="app-shell__link">{{ t('nav.transferPix') }}</RouterLink>
        <RouterLink :to="{ name: 'notifications' }" class="app-shell__link app-shell__link--badge">
          {{ t('nav.notifications') }}
          <span
            v-if="notifications.unreadCount > 0"
            class="app-shell__badge"
            data-testid="notifications-badge"
          >
            {{ notifications.unreadCount }}
          </span>
        </RouterLink>
        <RouterLink :to="{ name: 'settings' }" class="app-shell__link">{{ t('nav.settings') }}</RouterLink>
      </nav>
      <div class="app-shell__user" data-testid="shell-user">
        <span class="app-shell__avatar" aria-hidden="true">{{ initials }}</span>
        <span class="app-shell__username">{{ auth.user?.name }}</span>
      </div>
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
  justify-content: center;
  gap: var(--space-1) var(--space-2);
  flex: 1;
}

.app-shell__link {
  position: relative;
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

.app-shell__link--badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.app-shell__badge {
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-text-inverse);
  font-size: 0.7rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-shell__user {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text);
}

.app-shell__avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  font-size: var(--font-size-sm);
  font-weight: 700;
}

.app-shell__username {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.app-shell__content {
  flex: 1;
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5) var(--space-7);
}

@media (max-width: 860px) {
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
