import { useEffect, useState } from 'react'
import { apiFetch, ApiError } from '../../lib/api'
import { useAuth } from '../../auth/AuthContext'
import { UserStatusItem } from './types'

interface SubscriptionSummaryResponse {
  free: number
  subscribers: number
  cancelled: number
  total: number
}

const COLORS = {
  free: '#96998C',
  subscribers: '#BCFF00',
  cancelled: '#DC2626',
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
      .then((summary) => {
        if (cancelled) return
        setData([
          { name: 'Free', value: summary.free, color: COLORS.free },
          { name: 'Assinantes', value: summary.subscribers, color: COLORS.subscribers },
          { name: 'Cancelado', value: summary.cancelled, color: COLORS.cancelled },
        ])
        setTotal(summary.total)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar dados de usuários')
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