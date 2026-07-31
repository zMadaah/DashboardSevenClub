export type UserStatus = 'active' | 'inactive' | 'suspended'
export type UserRole = 'admin' | 'manager' | 'subscriber'
export type PaymentStatus = 'success' | 'failed' | 'refunded' | 'disputed'
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