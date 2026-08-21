import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { getActivitiesDailySummary } from './api'
import { DailySummaryRow } from './types'

export function useActivitiesDailySummary(activityType: 'run' | 'ride', days = 30) {
  const { token } = useAuth()
  const [rows, setRows] = useState<DailySummaryRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    getActivitiesDailySummary(activityType, days, token)
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar o resumo de atividades')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activityType, days, token])

  return { rows, isLoading, error }
}
