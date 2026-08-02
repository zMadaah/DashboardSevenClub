import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { listFlags } from './api'
import { AntiCheatCase } from './types'

export function useAntiCheatFlags() {
  const { token } = useAuth()
  const [cases, setCases] = useState<AntiCheatCase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    listFlags(token)
      .then((data) => {
        if (cancelled) return
        setCases(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar flags de anti-cheat')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, reloadKey])

  return { cases, isLoading, error, refetch: () => setReloadKey((k) => k + 1) }
}