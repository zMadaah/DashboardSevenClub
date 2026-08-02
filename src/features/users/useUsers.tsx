import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { listUsers, ListUsersParams } from './api'
import { SupportUser } from './types'

const DEBOUNCE_MS = 350

export function useUsers(params: ListUsersParams) {
  const { token } = useAuth()
  const [debouncedQuery, setDebouncedQuery] = useState(params.query ?? '')
  const [users, setUsers] = useState<SupportUser[]>([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: params.pageSize, total: 0, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  // Debounce só do texto de busca — os outros filtros (status/role/página)
  // já disparam a busca imediatamente, sem precisar disso.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(params.query ?? ''), DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [params.query])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    listUsers({ ...params, query: debouncedQuery }, token)
      .then((data) => {
        if (cancelled) return
        setUsers(data.users)
        setPagination(data.pagination)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar usuários')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, params.status, params.role, params.page, params.pageSize, token, reloadKey])

  function refetch() {
    setReloadKey((k) => k + 1)
  }

  return { users, pagination, isLoading, error, refetch }
}