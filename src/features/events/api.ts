import { apiFetch } from '../../lib/api'
import { CommunityEvent, EventStatus } from './types'

interface ApiEventRow {
  id: string
  name: string
  location: string
  eventDate: string
  status: EventStatus
  participants: number
  createdAt: string
}

interface EventsListResponse {
  events: ApiEventRow[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

function mapEvent(row: ApiEventRow): CommunityEvent {
  return {
    id: row.id,
    name: row.name,
    date: row.eventDate,
    location: row.location,
    participants: row.participants,
    status: row.status,
  }
}

export async function listEvents(status: EventStatus | 'all', token: string | null) {
  const qs = new URLSearchParams({ pageSize: '100' })
  if (status !== 'all') qs.set('status', status)
  const data = await apiFetch<EventsListResponse>(`/events?${qs.toString()}`, token)
  return data.events.map(mapEvent)
}

export interface CreateEventPayload {
  name: string
  location: string
  eventDate: string
}

export async function createEvent(payload: CreateEventPayload, token: string | null) {
  const row = await apiFetch<ApiEventRow>('/events', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return mapEvent(row)
}