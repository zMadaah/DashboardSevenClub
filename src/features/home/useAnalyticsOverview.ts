import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { fetchAnalyticsOverview, AnalyticsOverviewResponse, AnalyticsRange } from './analyticsApi'

export function useAnalyticsOverview(range: AnalyticsRange) {
  const { token } = useAuth()
  const [data, setData] = useState<AnalyticsOverviewResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const rangeKey = 'year' in range ? `${range.year}-${range.month}` : `days-${range.days}`

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    fetchAnalyticsOverview(range, token)
      .then((res) => {
        if (cancelled) return
        setData(res)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar análises')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeKey, token])

  return { data, isLoading, error }
}