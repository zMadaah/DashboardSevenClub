import { apiFetch } from '../../lib/api'
import { ActivityRow, TerritoryDominanceRow } from './types'

interface ActivitiesListResponse {
  activities: ActivityRow[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

export interface ListActivitiesParams {
  page: number
  pageSize: number
  activityType?: 'run' | 'ride'
}

export async function listActivities(params: ListActivitiesParams, token: string | null) {
  const qs = new URLSearchParams()
  qs.set('page', String(params.page))
  qs.set('pageSize', String(params.pageSize))
  if (params.activityType) qs.set('activityType', params.activityType)

  return apiFetch<ActivitiesListResponse>(`/analytics/activities?${qs.toString()}`, token)
}

export async function getTerritoryDominance(activityType: 'run' | 'ride', token: string | null) {
  return apiFetch<TerritoryDominanceRow[]>(`/analytics/territory?activityType=${activityType}`, token)
}
