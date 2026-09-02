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

export type AudienceCategory = 'free' | 'subscriber' | 'influencer' | 'cancelled'

export function getAudienceCount(category: AudienceCategory, token: string | null) {
  return apiFetch<{ count: number }>(`/staff-notifications/audience-count?category=${category}`, token)
}

export function broadcastToCategory(
  category: AudienceCategory,
  title: string,
  body: string,
  token: string | null,
) {
  return apiFetch<{ recipientCount: number; pushTokensFound: number }>('/staff-notifications/broadcast', token, {
    method: 'POST',
    body: JSON.stringify({ category, title, body }),
  })
}
