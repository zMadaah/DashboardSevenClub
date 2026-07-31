import { TicketStatus } from '../../types'

export interface ChatTicket {
  id: string
  user: string
  lastMessage: string
  status: TicketStatus
  updatedAt: string
}
