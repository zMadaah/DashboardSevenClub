import { apiFetch } from '../../lib/api'
import { UserRole, UserStatus } from '../../types'
import { SupportUser } from './types'

interface ApiUserRow {
  id: string
  first_name: string
  last_name: string
  username: string
  email: string
  phone: string | null
  status: UserStatus
  role: UserRole
  created_at: string
}

interface UsersListResponse {
  users: ApiUserRow[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

function mapUser(row: ApiUserRow): SupportUser {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    username: row.username,
    email: row.email,
    phone: row.phone ?? '',
    status: row.status,
    role: row.role,
  }
}

export interface ListUsersParams {
  query?: string
  status?: UserStatus | 'all'
  role?: UserRole | 'all'
  page: number
  pageSize: number
}

export async function listUsers(params: ListUsersParams, token: string | null) {
  const qs = new URLSearchParams()
  if (params.query) qs.set('query', params.query)
  if (params.status && params.status !== 'all') qs.set('status', params.status)
  if (params.role && params.role !== 'all') qs.set('role', params.role)
  qs.set('page', String(params.page))
  qs.set('pageSize', String(params.pageSize))

  const data = await apiFetch<UsersListResponse>(`/users?${qs.toString()}`, token)
  return {
    users: data.users.map(mapUser),
    pagination: data.pagination,
  }
}

export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  phone?: string
  role?: UserRole
}

export async function updateUser(id: string, payload: UpdateUserPayload, token: string | null) {
  const row = await apiFetch<ApiUserRow>(`/users/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return mapUser(row)
}

export async function updateUserStatus(id: string, status: UserStatus, token: string | null) {
  const row = await apiFetch<ApiUserRow>(`/users/${id}/status`, token, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return mapUser(row)
}

export async function sendTestNotification(
  userId: string,
  title: string,
  body: string,
  token: string | null,
) {
  return apiFetch<{ sent: boolean }>('/notifications/send-test', token, {
    method: 'POST',
    body: JSON.stringify({ userId, title, body }),
  })
}