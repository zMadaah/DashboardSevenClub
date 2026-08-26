import { apiFetch } from '../../lib/api'

interface PaymentsSummaryResponse {
  totalRevenue: number
  paidCount: number
  failuresToday: number
  refundedCount: number
}

interface CountOnlyResponse {
  pagination: { total: number }
}

export async function fetchPaymentsSummary(token: string | null) {
  return apiFetch<PaymentsSummaryResponse>('/payments/summary', token)
}

/** Conta tickets "novo" + "em andamento" — os dois estados que ainda precisam de atenção. */
export async function fetchOpenTicketsCount(token: string | null): Promise<number> {
  const [novos, emAndamento] = await Promise.all([
    apiFetch<CountOnlyResponse>('/support/tickets?status=new&pageSize=1', token),
    apiFetch<CountOnlyResponse>('/support/tickets?status=in_progress&pageSize=1', token),
  ])
  return novos.pagination.total + emAndamento.pagination.total
}