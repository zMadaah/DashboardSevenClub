import { apiFetch } from '../../lib/api'

export interface NotificationHistoryItem {
  id: string
  category: string
  title: string
  subtitle: string
  createdAt: string
  recipientName: string
}

interface NotificationsHistoryResponse {
  notifications: NotificationHistoryItem[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

export function getNotificationsHistory(page: number, token: string | null) {
  return apiFetch<NotificationsHistoryResponse>(`/staff-notifications?page=${page}&pageSize=20`, token)
}
