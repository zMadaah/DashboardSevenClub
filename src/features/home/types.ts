export interface SummaryCard {
  label: string
  value: number | string
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