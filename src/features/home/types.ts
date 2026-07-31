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