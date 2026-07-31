import { useMemo, useState } from 'react'
import { Search, ChevronDown, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'
import { Table, TableHead, TableRow, TableCell } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { EditUserModal } from './EditUserModal'
import { users as initialUsers } from './mocks'
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

export function UsersPage() {
  const [users, setUsers] = useState<SupportUser[]>(initialUsers)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null)
  const [editingUser, setEditingUser] = useState<SupportUser | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
      const matchesQuery =
        !q || fullName.includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q)
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter
      const matchesRole = roleFilter === 'all' || u.role === roleFilter
      return matchesQuery && matchesStatus && matchesRole
    })
  }, [users, query, statusFilter, roleFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function resetToFirstPage() {
    setPage(1)
  }

  function toggleSuspend(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u,
      ),
    )
    setMenuAnchor(null)
  }

  function toggleInactive(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'inactive' ? 'active' : 'inactive' } : u,
      ),
    )
    setMenuAnchor(null)
  }

  function handleSaveUser(updated: SupportUser) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    setEditingUser(null)
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
      <h1 className="text-xl font-semibold text-richBlack">Usuários</h1>

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
            className="w-full rounded-lg border border-celeste bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-richBlack"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter)
              resetToFirstPage()
            }}
            className="appearance-none rounded-lg border border-celeste bg-white py-2 pl-3 pr-8 text-sm text-richBlack outline-none focus:border-richBlack"
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
            className="appearance-none rounded-lg border border-celeste bg-white py-2 pl-3 pr-8 text-sm text-richBlack outline-none focus:border-richBlack"
          >
            <option value="all">Todos os roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Gerente</option>
            <option value="subscriber">Assinante</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-laurelLeaf" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="Nenhum usuário encontrado com esses filtros." />
      ) : (
        <Table>
          <TableHead>
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
            {paged.map((u) => (
              <TableRow key={u.id}>
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
                    className="rounded-md p-1.5 text-laurelLeaf transition-colors hover:bg-ceilingWhite hover:text-richBlack"
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
              className="appearance-none rounded-lg border border-celeste bg-white py-1.5 pl-3 pr-7 text-sm text-richBlack outline-none focus:border-richBlack"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-laurelLeaf" />
          </div>
          <span>por página · {filtered.length} usuário(s)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-celeste p-1.5 text-richBlack transition-colors hover:bg-ceilingWhite disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-richBlack">
            Página {currentPage} de {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-celeste p-1.5 text-richBlack transition-colors hover:bg-ceilingWhite disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {menuAnchor && menuUser && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuAnchor(null)} />
          <div
            className="fixed z-50 w-44 rounded-lg border border-celeste bg-white py-1 shadow-lg"
            style={{ top: menuAnchor.top, left: menuAnchor.left }}
          >
            <button
              onClick={() => {
                setEditingUser(menuUser)
                setMenuAnchor(null)
              }}
              className="block w-full px-3 py-2 text-left text-sm text-richBlack hover:bg-ceilingWhite"
            >
              Editar
            </button>
            <button
              onClick={() => toggleSuspend(menuUser.id)}
              className="block w-full px-3 py-2 text-left text-sm text-richBlack hover:bg-ceilingWhite"
            >
              {menuUser.status === 'suspended' ? 'Reativar conta' : 'Suspender conta'}
            </button>
            <button
              onClick={() => toggleInactive(menuUser.id)}
              className="block w-full px-3 py-2 text-left text-sm text-richBlack hover:bg-ceilingWhite"
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