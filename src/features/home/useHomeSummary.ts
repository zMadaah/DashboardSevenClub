import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { fetchOpenTicketsCount } from './api'
import { SummaryCard } from './types'

// Pagamentos, anti-cheat e receita ainda não têm API real (pagamentos
// depende de decisão de gateway; anti-cheat tem tabela mas a rota nunca
// foi construída) — só busca o que dá pra calcular de verdade hoje.
// Os cards "Em breve" correspondentes ficam fixos direto no componente,
// não tentam mais chamar rota nenhuma.
export function useHomeSummary() {
  const { token } = useAuth()
  const [cards, setCards] = useState<SummaryCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    fetchOpenTicketsCount(token)
      .then((openTickets) => {
        if (cancelled) return
        setCards([
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
