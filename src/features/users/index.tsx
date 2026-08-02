import { useState } from 'react'
import { Search, ChevronDown, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'
import { Table, TableHead, TableRow, TableCell } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { EditUserModal } from './EditUserModal'
import { useUsers } from './useUsers'
import { updateUser, updateUserStatus } from './api'
import { useAuth } from '../../auth/AuthContext'
import { SupportUser } from './types'
import { UserStatus, UserRole } from '../../types'

const statusTone: Record<UserStatus, 'success' | 'neutral' | 'danger'> = {
  active: 'success',
  inactive: 'neutral',
  suspended: 'danger',
}

const statusLabel: Record<UserStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  suspended: 'Suspenso',
}

const roleTone: Record<UserRole, 'warning' | 'neutral' | 'success'> = {
  admin: 'warning',
  manager: 'neutral',
  subscriber: 'success',
}

const roleLabel: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Gerente',
  subscriber: 'Assinante',
}

const PAGE_SIZE_OPTIONS = [10, 25, 50]

type StatusFilter = 'all' | UserStatus
type RoleFilter = 'all' | UserRole

interface MenuAnchor {
  userId: string
  top: number
  left: number
}

const selectClass =
  'appearance-none rounded-lg border border-surfaceBorder bg-surface py-2 pl-3 pr-8 text-sm text-ceilingWhite outline-none focus:border-pear'

export function UsersPage() {
  const { token } = useAuth()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null)
  const [editingUser, setEditingUser] = useState<SupportUser | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const { users, pagination, isLoading, error, refetch } = useUsers({
    query,
    status: statusFilter,
    role: roleFilter,
    page,
    pageSize,
  })

  function resetToFirstPage() {
    setPage(1)
  }

  async function toggleSuspend(user: SupportUser) {
    setMenuAnchor(null)
    setActionError(null)
    try {
      await updateUserStatus(user.id, user.status === 'suspended' ? 'active' : 'suspended', token)
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível atualizar o status.')
    }
  }

  async function toggleInactive(user: SupportUser) {
    setMenuAnchor(null)
    setActionError(null)
    try {
      await updateUserStatus(user.id, user.status === 'inactive' ? 'active' : 'inactive', token)
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível atualizar o status.')
    }
  }

  async function handleSaveUser(updated: SupportUser) {
    await updateUser(
      updated.id,
      {
        firstName: updated.firstName,
        lastName: updated.lastName,
        username: updated.username,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
      },
      token,
    )
    setEditingUser(null)
    refetch()
  }

  function openMenu(event: React.MouseEvent<HTMLButtonElement>, userId: string) {
    const rect = event.currentTarget.getBoundingClientRect()
    setMenuAnchor((current) =>
      current?.userId === userId
        ? null
        : { userId, top: rect.bottom + 6, left: rect.right - 176 },
    )
  }

  const menuUser = menuAnchor ? users.find((u) => u.id === menuAnchor.userId) : null

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-ceilingWhite">Usuários</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-laurelLeaf" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              resetToFirstPage()
            }}
            placeholder="Buscar por nome, email ou celular..."
            className="w-full rounded-lg border border-surfaceBorder bg-surface py-2 pl-9 pr-3 text-sm text-ceilingWhite outline-none placeholder:text-laurelLeaf/60 focus:border-pear"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter)
              resetToFirstPage()
            }}
            className={selectClass}
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="suspended">Suspenso</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-laurelLeaf" />
        </div>

        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as RoleFilter)
              resetToFirstPage()
            }}
            className={selectClass}
          >
            <option value="all">Todos os roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Gerente</option>
            <option value="subscriber">Assinante</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-laurelLeaf" />
        </div>
      </div>

      {actionError && <p className="text-sm text-red-400">{actionError}</p>}

      {isLoading ? (
        <p className="text-sm text-laurelLeaf">Carregando...</p>
      ) : error ? (
        <p className="text-sm text-red-400">Não foi possível carregar: {error}</p>
      ) : users.length === 0 ? (
        <EmptyState dark message="Nenhum usuário encontrado com esses filtros." />
      ) : (
        <Table dark>
          <TableHead dark>
            <tr>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Celular</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
              <TableCell className="w-10" />
            </tr>
          </TableHead>
          <tbody>
            {users.map((u) => (
              <TableRow key={u.id} dark>
                <TableCell>{u.firstName} {u.lastName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone}</TableCell>
                <TableCell>
                  <Badge label={statusLabel[u.status]} tone={statusTone[u.status]} />
                </TableCell>
                <TableCell>
                  <Badge label={roleLabel[u.role]} tone={roleTone[u.role]} />
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={(e) => openMenu(e, u.id)}
                    className="rounded-md p-1.5 text-laurelLeaf transition-colors hover:bg-white/5 hover:text-ceilingWhite"
                  >
                    <MoreVertical size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-laurelLeaf">
          <span>Mostrar</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                resetToFirstPage()
              }}
              className={`${selectClass} py-1.5 pr-7`}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-laurelLeaf" />
          </div>
          <span>por página · {pagination.total} usuário(s)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-surfaceBorder p-1.5 text-ceilingWhite transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-ceilingWhite">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-surfaceBorder p-1.5 text-ceilingWhite transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {menuAnchor && menuUser && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuAnchor(null)} />
          <div
            className="fixed z-50 w-44 rounded-lg border border-surfaceBorder bg-surface py-1 shadow-lg"
            style={{ top: menuAnchor.top, left: menuAnchor.left }}
          >
            <button
              onClick={() => {
                setEditingUser(menuUser)
                setMenuAnchor(null)
              }}
              className="block w-full px-3 py-2 text-left text-sm text-ceilingWhite hover:bg-white/5"
            >
              Editar
            </button>
            <button
              onClick={() => toggleSuspend(menuUser)}
              className="block w-full px-3 py-2 text-left text-sm text-ceilingWhite hover:bg-white/5"
            >
              {menuUser.status === 'suspended' ? 'Reativar conta' : 'Suspender conta'}
            </button>
            <button
              onClick={() => toggleInactive(menuUser)}
              className="block w-full px-3 py-2 text-left text-sm text-ceilingWhite hover:bg-white/5"
            >
              {menuUser.status === 'inactive' ? 'Marcar como ativo' : 'Marcar como inativo'}
            </button>
          </div>
        </>
      )}

      {editingUser && (
        <EditUserModal
          key={editingUser.id}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  )
}