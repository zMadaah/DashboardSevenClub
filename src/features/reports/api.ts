import { apiFetch } from '../../lib/api'

export type ReportStatus = 'pending' | 'reviewed' | 'dismissed'

export interface Report {
  id: string
  targetType: 'post' | 'comment'
  targetId: string
  postIdForComment: string | null
  status: ReportStatus
  createdAt: string
  reporterId: string
  reporterName: string
  contentText: string | null
  contentAuthorId: string | null
  contentAuthorName: string | null
}

interface ReportsResponse {
  reports: Report[]
}

export function getReports(status: ReportStatus | 'all', token: string | null) {
  const query = status === 'all' ? '' : `?status=${status}`
  return apiFetch<ReportsResponse>(`/reports${query}`, token)
}

export function updateReportStatus(id: string, status: 'reviewed' | 'dismissed', token: string | null) {
  return apiFetch<void>(`/reports/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
