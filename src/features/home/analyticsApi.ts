import { apiFetch } from '../../lib/api'

export interface WeeklyActivityPoint {
  date: string
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

export type AnalyticsRange = { days: number } | { year: number; month: number }

export function fetchAnalyticsOverview(range: AnalyticsRange, token: string | null) {
  const qs = new URLSearchParams()
  if ('year' in range) {
    qs.set('rangeYear', String(range.year))
    qs.set('rangeMonth', String(range.month))
  } else {
    qs.set('rangeDays', String(range.days))
  }

  return apiFetch<AnalyticsOverviewResponse>(`/analytics/overview?${qs.toString()}`, token)
}