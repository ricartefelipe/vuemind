<script setup lang="ts">
/**
 * Casco visual do app: marca + navegação fixa em cima, `<RouterView>` como
 * outlet abaixo. É o único lugar que sabe sobre as rotas de topo — as
 * telas (features) não precisam saber que existe um shell em volta.
 */
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="app-shell">
    <header class="app-shell__header">
      <span class="app-shell__brand">{{ t('app.name') }}</span>
      <nav class="app-shell__nav">
        <RouterLink to="/" class="app-shell__link">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/settings" class="app-shell__link">{{ t('nav.settings') }}</RouterLink>
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

.app-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.app-shell__brand {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary-strong);
}

.app-shell__nav {
  display: flex;
  gap: var(--space-4);
}

.app-shell__link {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  padding: var(--space-1) 0;
  border-bottom: 2px solid transparent;
}

.app-shell__link:hover {
  color: var(--color-text);
}

.app-shell__link.router-link-active {
  color: var(--color-primary-strong);
  border-bottom-color: var(--color-accent);
}

.app-shell__content {
  flex: 1;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5);
}
</style>
