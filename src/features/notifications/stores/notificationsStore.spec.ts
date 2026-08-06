import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNotificationsStore } from './notificationsStore'

vi.mock('@/features/notifications/api/notificationsApi', () => ({
  notificationsApi: {
    list: vi.fn(async () => ({
      items: [
        {
          id: 'n1',
          title: 'PIX recebido',
          body: 'Você recebeu um PIX',
          read: false,
          createdAt: '2026-08-01T00:00:00.000Z',
        },
        {
          id: 'n2',
          title: 'Limite',
          body: 'Limite próximo',
          read: true,
          createdAt: '2026-08-01T00:00:00.000Z',
        },
      ],
    })),
    markRead: vi.fn(async () => undefined),
    markAllRead: vi.fn(async () => undefined),
  },
}))

describe('useNotificationsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('conta não lidas e marca uma', async () => {
    const store = useNotificationsStore()
    await store.load()

    expect(store.unreadCount).toBe(1)
    await store.markRead('n1')
    expect(store.unreadCount).toBe(0)
    expect(store.items?.find((item) => item.id === 'n1')?.read).toBe(true)
  })

  it('marca todas como lidas', async () => {
    const store = useNotificationsStore()
    await store.load()
    await store.markAllRead()

    expect(store.unreadCount).toBe(0)
    expect(store.items?.every((item) => item.read)).toBe(true)
  })
})
