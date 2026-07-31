export type EventStatus = 'scheduled' | 'live' | 'finished' | 'cancelled'

export interface CommunityEvent {
  id: string
  name: string
  date: string
  participants: number
  status: EventStatus
}
