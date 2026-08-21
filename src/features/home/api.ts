import { apiFetch } from '../../lib/api'

interface CountOnlyResponse {
  pagination: { total: number }
}

/** Conta tickets "novo" + "em andamento" — os dois estados que ainda precisam de atenção. */
export async function fetchOpenTicketsCount(token: string | null): Promise<number> {
  const [novos, emAndamento] = await Promise.all([
    apiFetch<CountOnlyResponse>('/support/tickets?status=new&pageSize=1', token),
    apiFetch<CountOnlyResponse>('/support/tickets?status=in_progress&pageSize=1', token),
  ])
  return novos.pagination.total + emAndamento.pagination.total
}