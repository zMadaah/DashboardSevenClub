import { useEffect, useState } from 'react'
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

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    listActivities(params, token)
      .then((data) => {
        if (cancelled) return
        setActivities(data.activities)
        setPagination(data.pagination)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar atividades')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.pageSize, params.activityType, token])

  return { activities, pagination, isLoading, error }
}
