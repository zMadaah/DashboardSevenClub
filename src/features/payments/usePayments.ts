import { useCallback, useEffect, useState } from 'react'
import { apiFetch, ApiError } from '../../lib/api'
import { useAuth } from '../../auth/AuthContext'
import { PaymentStatus } from '../../types'
import { Payment } from './types'

interface PaymentsResponse {
  payments: Payment[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

export type PaymentFilter = 'all' | PaymentStatus

export function usePayments(status: PaymentFilter) {
  const { token } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = useCallback(() => {
    setIsLoading(true)
    // pageSize alto pra não precisar de paginação ainda — dá pra adicionar
    // paginação de verdade quando o volume de pagamentos crescer.
    const path = status === 'all' ? '/payments?pageSize=100' : `/payments?status=${status}&pageSize=100`

    apiFetch<PaymentsResponse>(path, token)
      .then((data) => {
        setPayments(data.payments)
        setError(null)
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar pagamentos')
      })
      .finally(() => setIsLoading(false))
  }, [status, token])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  return { payments, isLoading, error, refetch: fetchPayments }
}