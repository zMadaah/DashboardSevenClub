import { apiFetch } from '../../lib/api'
import { TicketStatus } from '../../types'
import { ChatTicket } from './types'

interface ApiTicketRow {
  id: string
  userId: string
  userName: string
  status: TicketStatus
  lastMessage: string | null
  updatedAt: string
  createdAt: string
}

interface TicketsListResponse {
  tickets: ApiTicketRow[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

interface ApiMessageRow {
  id: string
  ticket_id: string
  sender: 'user' | 'staff'
  staff_id: string | null
  message: string
  created_at: string
}

export interface ChatMessage {
  id: string
  ticketId: string
  sender: 'user' | 'staff'
  staffId: string | null
  message: string
  createdAt: string
}

function mapTicket(row: ApiTicketRow): ChatTicket {
  return {
    id: row.id,
    user: row.userName,
    lastMessage: row.lastMessage ?? '',
    status: row.status,
    updatedAt: row.updatedAt,
  }
}

function mapMessage(row: ApiMessageRow): ChatMessage {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    sender: row.sender,
    staffId: row.staff_id,
    message: row.message,
    createdAt: row.created_at,
  }
}

export async function listTickets(token: string | null): Promise<ChatTicket[]> {
  const data = await apiFetch<TicketsListResponse>('/support/tickets?pageSize=100', token)
  return data.tickets.map(mapTicket)
}

export async function getMessages(ticketId: string, token: string | null): Promise<ChatMessage[]> {
  const rows = await apiFetch<ApiMessageRow[]>(`/support/tickets/${ticketId}/messages`, token)
  return rows.map(mapMessage)
}

export async function sendStaffMessage(
  ticketId: string,
  message: string,
  token: string | null,
): Promise<ChatMessage> {
  const row = await apiFetch<ApiMessageRow>(`/support/tickets/${ticketId}/messages`, token, {
    method: 'POST',
    body: JSON.stringify({ sender: 'staff', message }),
  })
  return mapMessage(row)
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus,
  token: string | null,
): Promise<ChatTicket> {
  const row = await apiFetch<ApiTicketRow>(`/support/tickets/${ticketId}/status`, token, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return mapTicket(row)
}