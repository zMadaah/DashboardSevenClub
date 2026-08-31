import { apiFetch } from '../../lib/api'

export interface SeasonInfo {
  id: string
  number: number
  name: string
  startsAt: string
  endsAt: string
}

export interface SeasonResetResult {
  previousSeasonNumber: number
  newSeasonNumber: number
  newSeasonId: string
}

export function getCurrentSeason(token: string | null) {
  return apiFetch<SeasonInfo>('/seasons/current', token)
}

export function resetSeason(token: string | null) {
  return apiFetch<SeasonResetResult>('/seasons/reset', token, { method: 'POST' })
}
