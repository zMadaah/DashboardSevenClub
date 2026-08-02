import { apiFetch } from '../../lib/api'

interface PaymentsSummaryResponse {
  byStatus: { success: number; failed: number; refunded: number; disputed: number }
  failuresToday: number
  totalRevenue: number
}

interface CountOnlyResponse {
  pagination: { total: number }
}

export interface RecentPaymentRow {
  id: string
  userId: string
  userName: string
  amount: number
  status: string
  gateway: string
  paidAt: string
}

export async function fetchPaymentsSummary(token: string | null) {
  return apiFetch<PaymentsSummaryResponse>('/payments/summary', token)
}

export async function fetchPendingFlagsCount(token: string | null): Promise<number> {
  const data = await apiFetch<CountOnlyResponse>('/anti-cheat/flags?status=pending&pageSize=1', token)
  return data.pagination.total
}

/** Conta tickets "novo" + "em andamento" — os dois estados que ainda precisam de atenção. */
export async function fetchOpenTicketsCount(token: string | null): Promise<number> {
  const [novos, emAndamento] = await Promise.all([
    apiFetch<CountOnlyResponse>('/support/tickets?status=new&pageSize=1', token),
    apiFetch<CountOnlyResponse>('/support/tickets?status=in_progress&pageSize=1', token),
  ])
  return novos.pagination.total + emAndamento.pagination.total
}

export async function fetchRecentPayments(token: string | null): Promise<RecentPaymentRow[]> {
  return apiFetch<RecentPaymentRow[]>('/payments/recent?limit=5', token)
}