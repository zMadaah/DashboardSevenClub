import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { fetchPaymentsSummary, fetchPendingFlagsCount, fetchOpenTicketsCount } from './api'
import { SummaryCard } from './types'

export function useHomeSummary() {
  const { token } = useAuth()
  const [cards, setCards] = useState<SummaryCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    Promise.all([
      fetchPaymentsSummary(token),
      fetchPendingFlagsCount(token),
      fetchOpenTicketsCount(token),
    ])
      .then(([paymentsSummary, pendingFlags, openTickets]) => {
        if (cancelled) return
        const ticketsAbertos = paymentsSummary.failuresToday + pendingFlags + openTickets

        setCards([
          { label: 'Tickets abertos', value: ticketsAbertos, trend: 'soma dos indicadores abaixo' },
          { label: 'Falhas de pagamento hoje', value: paymentsSummary.failuresToday, trend: 'hoje' },
          { label: 'Fila anti-cheat', value: pendingFlags, trend: 'pendentes de revisão' },
          { label: 'Tickets de suporte abertos', value: openTickets, trend: 'novos + em andamento' },
        ])
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar resumo')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return { cards, isLoading, error }
}