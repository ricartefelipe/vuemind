export type Notification = {
  id: string
  title: string
  body: string
  read: boolean
  createdAt: string
}

export type NotificationsPage = {
  items: Notification[]
}
