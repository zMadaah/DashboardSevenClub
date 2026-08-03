import { apiFetch } from '../../lib/api'

export interface WeeklyActivityPoint {
  day: string
  activities: number
  territories: number
}

export interface AnalyticsStatsResponse {
  activitiesThisWeek: number
  activeUsersThisWeek: number
  cancellationRate: number
  avgResponseMinutes: number | null
}

export type StatusCounts = Record<string, number>

export interface AnalyticsOverviewResponse {
  weeklyActivity: WeeklyActivityPoint[]
  stats: AnalyticsStatsResponse
  eventsByStatus: StatusCounts
  antiCheatByStatus: StatusCounts
}

export function fetchAnalyticsOverview(token: string | null) {
  return apiFetch<AnalyticsOverviewResponse>('/analytics/overview', token)
}