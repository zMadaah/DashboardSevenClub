import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { CreateEventModal } from './CreateEventModal'
import { useEvents } from './useEvents'
import { createEvent, CreateEventPayload } from './api'
import { useAuth } from '../../auth/AuthContext'
import { useTheme } from '../../theme/ThemeContext'
import { formatDateTime } from '../../lib/format'
import { EventStatus } from './types'

const statusTone: Record<EventStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  scheduled: 'neutral',
  live: 'success',
  finished: 'neutral',
  cancelled: 'danger',
}

const statusLabel: Record<EventStatus, string> = {
  scheduled: 'Agendado',
  live: 'Ao vivo',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
}

type StatusFilter = 'all' | EventStatus

const filters: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'scheduled', label: 'Agendado' },
  { key: 'live', label: 'Ao vivo' },
  { key: 'finished', label: 'Finalizado' },
  { key: 'cancelled', label: 'Cancelado' },
]

export function EventsPage() {
  const { token } = useAuth()
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const { events, isLoading, error, refetch } = useEvents(statusFilter)

  const textPrimary = dark ? 'text-ceilingWhite' : 'text-richBlack'

  async function handleCreate(input: CreateEventPayload) {
    await createEvent(input, token)
    setModalOpen(false)
    refetch()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${textPrimary}`}>Evento</h1>
          <p className="text-sm text-laurelLeaf">Eventos comunitários e desafios entre crews</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-pear px-4 py-2 text-sm font-medium text-richBlack transition-colors hover:bg-pear/90"
        >
          <Plus size={14} />
          Novo evento
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === f.key
                ? 'bg-pear text-richBlack'
                : dark
                  ? 'border border-surfaceBorder text-laurelLeaf hover:text-ceilingWhite'
                  : 'border border-celeste text-laurelLeaf hover:text-richBlack'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card dark={dark}>
        <h2 className={`mb-4 text-sm font-medium ${textPrimary}`}>Histórico</h2>

        {isLoading ? (
          <p className="text-sm text-laurelLeaf">Carregando...</p>
        ) : error ? (
          <p className="text-sm text-red-400">Não foi possível carregar: {error}</p>
        ) : events.length === 0 ? (
          <EmptyState dark={dark} message="Nenhum evento encontrado com esse filtro." />
        ) : (
          <div className={`flex flex-col divide-y ${dark ? 'divide-white/5' : 'divide-celeste'}`}>
            {events.map((e) => (
              <div key={e.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${textPrimary}`}>{e.name}</p>
                  <p className="truncate text-xs text-laurelLeaf">{e.location}</p>
                </div>
                <span className="w-24 shrink-0 text-xs text-laurelLeaf">
                  {e.participants} pessoas
                </span>
                <Badge label={statusLabel[e.status]} tone={statusTone[e.status]} />
                <span className="w-40 shrink-0 text-right text-xs text-laurelLeaf">
                  {formatDateTime(e.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {modalOpen && <CreateEventModal onClose={() => setModalOpen(false)} onCreate={handleCreate} />}
    </div>
  )
}