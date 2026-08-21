import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { listActivities, ListActivitiesParams } from './api'
import { ActivityRow } from './types'

export function useActivities(params: ListActivitiesParams) {
  const { token } = useAuth()
  const [activities, setActivities] = useState<ActivityRow[]>([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: params.pageSize, total: 0, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(() => {
    setIsLoading(true)
    return listActivities(params, token)
      .then((data) => {
        setActivities(data.activities)
        setPagination(data.pagination)
        setError(null)
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar atividades')
      })
      .finally(() => {
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.pageSize, params.activityType, token])

  useEffect(() => {
    let cancelled = false
    fetchActivities().then(() => {
      if (cancelled) return
    })
    return () => {
      cancelled = true
    }
  }, [fetchActivities])

  return { activities, pagination, isLoading, error, refetch: fetchActivities }
}
