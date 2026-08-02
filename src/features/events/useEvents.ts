import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { listEvents } from './api'
import { CommunityEvent, EventStatus } from './types'

export function useEvents(status: EventStatus | 'all') {
  const { token } = useAuth()
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    listEvents(status, token)
      .then((data) => {
        if (cancelled) return
        setEvents(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar eventos')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [status, token, reloadKey])

  return { events, isLoading, error, refetch: () => setReloadKey((k) => k + 1) }
}