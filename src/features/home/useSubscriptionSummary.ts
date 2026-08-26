import { useEffect, useState } from 'react'
import { apiFetch, ApiError } from '../../lib/api'
import { useAuth } from '../../auth/AuthContext'
import { UserStatusItem } from './types'

interface SubscriptionSummaryResponse {
  total: number
  breakdown: { status: string; count: number }[]
}

const STATUS_COLOR: Record<string, string> = {
  active: '#BCFF00',
  free: '#96998C',
  canceled: '#D85A30',
  past_due: '#E8B339',
  expired: '#5C6660',
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Assinante ativo',
  free: 'Gratuito',
  canceled: 'Cancelado',
  past_due: 'Pagamento atrasado',
  expired: 'Expirado',
}

export function useSubscriptionSummary() {
  const { token } = useAuth()
  const [data, setData] = useState<UserStatusItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    apiFetch<SubscriptionSummaryResponse>('/users/subscription-summary', token)
      .then((result) => {
        if (cancelled) return
        setData(
          result.breakdown.map((b) => ({
            name: STATUS_LABEL[b.status] ?? b.status,
            value: b.count,
            color: STATUS_COLOR[b.status] ?? '#96998C',
          }))
        )
        setTotal(result.total)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return { data, total, isLoading, error }
}
