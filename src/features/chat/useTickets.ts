import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { listTickets } from './api'
import { ChatTicket } from './types'

export function useTickets() {
  const { token } = useAuth()
  const [tickets, setTickets] = useState<ChatTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    listTickets(token)
      .then((data) => {
        if (cancelled) return
        setTickets(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar tickets')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, reloadKey])

  return { tickets, isLoading, error, refetch: () => setReloadKey((k) => k + 1) }
}

