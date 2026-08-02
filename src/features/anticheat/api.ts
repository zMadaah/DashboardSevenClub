import { apiFetch } from '../../lib/api'
import { AntiCheatStatus } from '../../types'
import { AntiCheatCase, ActivityRoute } from './types'

interface ApiFlagRow {
  id: string
  activityId: string
  userId: string
  userName: string
  anomaly: string
  riskScore: number
  status: AntiCheatStatus
  createdAt: string
  reviewedAt: string | null
  activity: {
    distanceMeters: number
    durationSeconds: number
    route: ActivityRoute | null
  }
}

interface FlagsListResponse {
  flags: ApiFlagRow[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

function mapFlag(row: ApiFlagRow): AntiCheatCase {
  return {
    id: row.id,
    user: row.userName,
    anomaly: row.anomaly,
    riskScore: row.riskScore,
    status: row.status,
    date: row.createdAt,
    activity: row.activity,
  }
}

export async function listFlags(token: string | null): Promise<AntiCheatCase[]> {
  const data = await apiFetch<FlagsListResponse>('/anti-cheat/flags?pageSize=100', token)
  return data.flags.map(mapFlag)
}

export async function updateFlagStatus(
  id: string,
  status: AntiCheatStatus,
  token: string | null,
): Promise<AntiCheatCase> {
  const row = await apiFetch<ApiFlagRow>(`/anti-cheat/flags/${id}/status`, token, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return mapFlag(row)
}