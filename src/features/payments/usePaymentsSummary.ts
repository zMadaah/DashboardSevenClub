import { useEffect, useState } from 'react'
import { apiFetch, ApiError } from '../../lib/api'
import { useAuth } from '../../auth/AuthContext'

interface PaymentsSummary {
  totalRevenue: number
  paidCount: number
  failuresToday: number
  refundedCount: number
  byStatus: Record<string, number>
}

export function usePaymentsSummary() {
  const { token } = useAuth()
  const [summary, setSummary] = useState<PaymentsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    apiFetch<PaymentsSummary>('/payments/summary', token)
      .then((data) => {
        if (cancelled) return
        setSummary(data)
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

  return { summary, isLoading, error }
}
