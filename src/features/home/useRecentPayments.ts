import { useEffect, useState } from 'react'
import { apiFetch, ApiError } from '../../lib/api'
import { useAuth } from '../../auth/AuthContext'
import { RecentPayment } from './types'

interface RecentPaymentApiRow {
  id: string
  userId: string
  userName: string
  amount: number
  status: string
  gateway: string
  paidAt: string | null
  createdAt: string
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function useRecentPayments() {
  const { token } = useAuth()
  const [payments, setPayments] = useState<RecentPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    apiFetch<RecentPaymentApiRow[]>('/payments/recent?limit=5', token)
      .then((rows) => {
        if (cancelled) return
        setPayments(
          rows
            .filter((r) => r.status === 'paid')
            .map((r) => ({
              id: r.id,
              name: r.userName,
              initials: initialsOf(r.userName),
              gateway: r.gateway,
              amount: r.amount,
            }))
        )
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

  return { payments, isLoading, error }
}
