import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { notificationsApi } from '@/features/notifications/api/notificationsApi'
import { useAsyncState } from '@/shared/composables/useAsyncState'
import type { Notification } from '@/features/notifications/types'

export const useNotificationsStore = defineStore('notifications', () => {
  const listState = useAsyncState<Notification[]>()
  const mutating = ref(false)
  const mutateError = ref<Error | null>(null)

  const items = computed(() => listState.data.value)
  const unreadCount = computed(
    () => (listState.data.value ?? []).filter((item) => !item.read).length,
  )

  async function load(): Promise<void> {
    try {
      await listState.run(async () => (await notificationsApi.list()).items)
    } catch {
    }
  }

  async function markRead(id: string): Promise<void> {
    mutating.value = true
    mutateError.value = null
    try {
      await notificationsApi.markRead(id)
      const current = listState.data.value ?? []
      listState.data.value = current.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      )
    } catch (err) {
      mutateError.value = err as Error
      throw err
    } finally {
      mutating.value = false
    }
  }

  async function markAllRead(): Promise<void> {
    mutating.value = true
    mutateError.value = null
    try {
      await notificationsApi.markAllRead()
      const current = listState.data.value ?? []
      listState.data.value = current.map((item) => ({ ...item, read: true }))
    } catch (err) {
      mutateError.value = err as Error
      throw err
    } finally {
      mutating.value = false
    }
  }

  return {
    items,
    unreadCount,
    loading: listState.loading,
    error: listState.error,
    mutating,
    mutateError,
    load,
    markRead,
    markAllRead,
  }
})
