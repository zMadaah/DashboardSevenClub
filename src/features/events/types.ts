export type EventStatus = 'scheduled' | 'live' | 'finished' | 'cancelled'

export interface CommunityEvent {
  id: string
  name: string
  date: string
  location: string
  participants: number
  status: EventStatus
}