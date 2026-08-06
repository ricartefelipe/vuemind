<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationsStore } from '@/features/notifications/stores/notificationsStore'
import Skeleton from '@/shared/ui/Skeleton.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import { ApiError } from '@/shared/http/errors'

const { t, locale } = useI18n()
const store = useNotificationsStore()

onMounted(() => {
  store.load()
})

function correlationFrom(error: Error | null): string | undefined {
  return error instanceof ApiError ? error.correlationId : undefined
}
</script>

<template>
  <section class="notifications-view">
    <header class="notifications-view__header">
      <h1>{{ t('notifications.title') }}</h1>
      <AppButton
        v-if="store.unreadCount > 0"
        variant="secondary"
        :disabled="store.mutating"
        data-testid="notifications-read-all"
        @click="store.markAllRead()"
      >
        {{ t('notifications.markAllRead') }}
      </AppButton>
    </header>

    <ErrorBanner
      v-if="store.mutateError"
      :message="store.mutateError.message || t('common.error')"
      :correlation-id="correlationFrom(store.mutateError)"
    />

    <Skeleton v-if="store.loading || (store.items === null && !store.error)" :lines="4" />
    <ErrorBanner
      v-else-if="store.error"
      :message="store.error.message || t('common.error')"
      :correlation-id="correlationFrom(store.error)"
    >
      <template #action>
        <AppButton variant="secondary" @click="store.load()">{{ t('common.retry') }}</AppButton>
      </template>
    </ErrorBanner>
    <EmptyState
      v-else-if="store.items !== null && store.items.length === 0"
      :title="t('notifications.empty.title')"
      :description="t('notifications.empty.description')"
    />
    <ul v-else-if="store.items !== null" class="notifications-view__list" data-testid="notifications-list">
      <li
        v-for="item in store.items"
        :key="item.id"
        class="notifications-view__item"
        :class="{ 'notifications-view__item--unread': !item.read }"
        :data-testid="`notification-${item.id}`"
      >
        <div>
          <strong>{{ item.title }}</strong>
          <p>{{ item.body }}</p>
          <time>{{ new Date(item.createdAt).toLocaleString(locale) }}</time>
        </div>
        <AppButton
          v-if="!item.read"
          variant="ghost"
          :disabled="store.mutating"
          data-testid="notification-mark-read"
          @click="store.markRead(item.id)"
        >
          {{ t('notifications.markRead') }}
        </AppButton>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.notifications-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.notifications-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}

.notifications-view__header h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
}

.notifications-view__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.notifications-view__item {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.notifications-view__item--unread {
  border-color: color-mix(in srgb, var(--color-accent) 50%, var(--color-border));
  background: color-mix(in srgb, var(--color-accent-soft) 55%, var(--color-surface));
}

.notifications-view__item p {
  margin: 0.35rem 0;
  color: var(--color-text);
}

.notifications-view__item time {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
