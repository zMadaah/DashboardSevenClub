import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { fetchOpenTicketsCount, fetchPaymentsSummary } from './api'
import { SummaryCard } from './types'

// Anti-cheat ainda não tem API real (tem tabela, mas a rota nunca foi
// construída) — só esse card continua "Em breve" fixo. Pagamentos e
// receita já têm dado real desde que a integração com a Asaas ficou de
// pé.
export function useHomeSummary() {
  const { token } = useAuth()
  const [cards, setCards] = useState<SummaryCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    Promise.all([fetchOpenTicketsCount(token), fetchPaymentsSummary(token)])
      .then(([openTickets, payments]) => {
        if (cancelled) return
        setCards([
          { label: 'Tickets de suporte abertos', value: openTickets, trend: 'novos + em andamento' },
          { label: 'Falhas de pagamento hoje', value: payments.failuresToday, trend: 'últimas 24h' },
          {
            label: 'Receita total',
            value: `R$ ${payments.totalRevenue.toFixed(2).replace('.', ',')}`,
            trend: `${payments.paidCount} pagamentos confirmados`,
          },
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
