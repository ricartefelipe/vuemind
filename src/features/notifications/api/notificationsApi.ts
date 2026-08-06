import { http } from '@/shared/http/client'
import type { NotificationsPage } from '@/features/notifications/types'

export const notificationsApi = {
  list: (): Promise<NotificationsPage> => http.get<NotificationsPage>('/notifications'),
  markRead: (id: string): Promise<void> => http.post<void>(`/notifications/${id}/read`),
  markAllRead: (): Promise<void> => http.post<void>('/notifications/read-all'),
}
