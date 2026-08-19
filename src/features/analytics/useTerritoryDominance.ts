import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { getTerritoryDominance } from './api'
import { TerritoryDominanceRow } from './types'

export function useTerritoryDominance(activityType: 'run' | 'ride') {
  const { token } = useAuth()
  const [rows, setRows] = useState<TerritoryDominanceRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    getTerritoryDominance(activityType, token)
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar domínio de território')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activityType, token])

  return { rows, isLoading, error }
}
