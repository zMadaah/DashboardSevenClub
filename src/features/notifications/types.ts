export type NotificationAudience = 'all' | 'subscribers' | 'free' | 'cancelled' | 'inactive'
export type NotificationStatus = 'sent' | 'scheduled' | 'draft'

export interface NotificationRecord {
  id: string
  title: string
  message: string
  audience: NotificationAudience
  status: NotificationStatus
  reach: number
  date: string
}