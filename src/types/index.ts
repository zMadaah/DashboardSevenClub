export type UserStatus = 'active' | 'inactive' | 'suspended'
// Valores reais do app_users.role — antes esse tipo tinha valores de um
// design anterior (admin/manager/subscriber) que nunca bateram com o
// que o backend realmente salva.
export type UserRole = 'free' | 'subscriber' | 'influencer'
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded'
export type TicketStatus = 'new' | 'in_progress' | 'resolved'
export type AntiCheatStatus = 'pending' | 'approved' | 'invalidated' | 'warned' | 'banned'
export interface SummaryCard {
  label: string
  value: number
  trend: string
}

export interface UserStatusItem {
  name: string
  value: number
  color: string
}

export interface RegionUserCount {
  region: string
  users: number
}

export interface RecentPayment {
  id: string
  name: string
  initials: string
  gateway: string
  amount: number
}

export interface WeeklyActivityPoint {
  day: string
  activities: number
  territories: number
}

export interface AnalyticsStat {
  label: string
  value: string
  trend: string
}

export interface ChannelValue {
  name: string
  value: number
}

export interface DeviceShare {
  name: string
  percentage: number
}