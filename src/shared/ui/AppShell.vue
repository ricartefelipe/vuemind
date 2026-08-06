<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { useNotificationsStore } from '@/features/notifications/stores/notificationsStore'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const notifications = useNotificationsStore()
const menuOpen = ref(false)
const menuRoot = ref<HTMLElement | null>(null)

const initials = computed(() => {
  const name = auth.user?.name?.trim() ?? ''
  if (!name) return '?'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function goSettings() {
  closeMenu()
  void router.push({ name: 'settings' })
}

function handleLogout() {
  closeMenu()
  auth.logout()
  void router.push({ name: 'login' })
}

function onDocumentClick(event: MouseEvent) {
  if (!menuOpen.value || !menuRoot.value) return
  if (!menuRoot.value.contains(event.target as Node)) closeMenu()
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  if (auth.isAuthenticated) notifications.load()
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})

watch(
  () => auth.isAuthenticated,
  (authenticated) => {
    if (authenticated) notifications.load()
    else closeMenu()
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
      <div ref="menuRoot" class="app-shell__user-menu">
        <button
          type="button"
          class="app-shell__user"
          data-testid="shell-user"
          :aria-expanded="menuOpen"
          aria-haspopup="menu"
          :aria-label="t('account.menu')"
          @click.stop="toggleMenu"
        >
          <span class="app-shell__avatar" aria-hidden="true">{{ initials }}</span>
          <span class="app-shell__username">{{ auth.user?.name }}</span>
        </button>
        <div
          v-if="menuOpen"
          class="app-shell__menu"
          role="menu"
          data-testid="shell-user-menu"
        >
          <div class="app-shell__menu-profile" role="none">
            <p class="app-shell__menu-label">{{ t('account.profile') }}</p>
            <p class="app-shell__menu-name">{{ auth.user?.name }}</p>
            <p class="app-shell__menu-email">{{ auth.user?.email }}</p>
          </div>
          <button
            type="button"
            class="app-shell__menu-item"
            role="menuitem"
            data-testid="shell-account-settings"
            @click="goSettings"
          >
            {{ t('account.settings') }}
          </button>
          <button
            type="button"
            class="app-shell__menu-item app-shell__menu-item--danger"
            role="menuitem"
            data-testid="shell-logout"
            @click="handleLogout"
          >
            {{ t('account.logout') }}
          </button>
        </div>
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

.app-shell__user-menu {
  position: relative;
}

.app-shell__user {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text);
  background: transparent;
  border: 0;
  padding: 0.25rem 0.4rem;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
}

.app-shell__user:hover,
.app-shell__user[aria-expanded='true'] {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
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

.app-shell__menu {
  position: absolute;
  top: calc(100% + 0.4rem);
  right: 0;
  min-width: 14rem;
  padding: 0.5rem;
  border-radius: 0.85rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  background: var(--color-surface-elevated);
  box-shadow: 0 12px 32px color-mix(in srgb, #000 18%, transparent);
  z-index: 30;
  display: grid;
  gap: 0.25rem;
}

.app-shell__menu-profile {
  padding: 0.55rem 0.65rem 0.7rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  margin-bottom: 0.25rem;
}

.app-shell__menu-label {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.app-shell__menu-name {
  margin: 0.35rem 0 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text);
}

.app-shell__menu-email {
  margin: 0.15rem 0 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  word-break: break-all;
}

.app-shell__menu-item {
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  border-radius: 0.55rem;
  padding: 0.55rem 0.65rem;
  font: inherit;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
}

.app-shell__menu-item:hover {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.app-shell__menu-item--danger {
  color: #b42318;
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

  .app-shell__user-menu {
    align-self: flex-end;
  }
}
</style>
