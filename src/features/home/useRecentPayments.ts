import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { getInitials } from '../../lib/format'
import { fetchRecentPayments } from './api'
import { RecentPayment } from './types'

export function useRecentPayments() {
  const { token } = useAuth()
  const [payments, setPayments] = useState<RecentPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    fetchRecentPayments(token)
      .then((rows) => {
        if (cancelled) return
        setPayments(
          rows.map((row) => ({
            id: row.id,
            name: row.userName,
            initials: getInitials(row.userName),
            gateway: row.gateway,
            amount: row.amount,
          })),
        )
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar pagamentos recentes')
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