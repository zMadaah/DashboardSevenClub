import { useState } from 'react'
import { Activity, Trophy, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Table, TableHead, TableRow, TableCell } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { useActivities } from './useActivities'
import { useTerritoryDominance } from './useTerritoryDominance'
import { useActivitiesDailySummary } from './useActivitiesDailySummary'
import { ActivitiesChart } from './components/ActivitiesChart'
import { TerritoryDominanceChart } from './components/TerritoryDominanceChart'
import { deleteActivity } from './api'
import { useAuth } from '../../auth/AuthContext'
import { useTheme } from '../../theme/ThemeContext'
import { formatDateTime } from '../../lib/format'

type Tab = 'activities' | 'territory'
type ActivityTypeFilter = 'run' | 'ride'

const PAGE_SIZE = 20

function formatDistance(meters: number): string {
  return `${(meters / 1000).toFixed(2)} km`
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m}min`
}

export function AnalyticsPage() {
  const { theme } = useTheme()
  const { token } = useAuth()
  const dark = theme === 'dark'
  const [tab, setTab] = useState<Tab>('activities')
  const [activityType, setActivityType] = useState<ActivityTypeFilter>('run')
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const {
    activities,
    pagination,
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities,
  } = useActivities({ page, pageSize: PAGE_SIZE, activityType })

  async function handleDelete(activityId: string, activityName: string) {
    if (!window.confirm(`Apagar a atividade "${activityName}"? Não reverte território já capturado.`)) {
      return
    }
    setDeletingId(activityId)
    try {
      await deleteActivity(activityId, token)
      await refetchActivities()
    } catch {
      window.alert('Não foi possível apagar essa atividade.')
    } finally {
      setDeletingId(null)
    }
  }

  const {
    rows: territoryRows,
    isLoading: territoryLoading,
    error: territoryError,
  } = useTerritoryDominance(activityType)

  const { rows: dailySummary, isLoading: summaryLoading } = useActivitiesDailySummary(activityType, 30)

  const tabs: { id: Tab; label: string; icon: typeof Activity }[] = [
    { id: 'activities', label: 'Atividades registradas', icon: Activity },
    { id: 'territory', label: 'Domínio de território', icon: Trophy },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className={`text-lg font-semibold ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>
          Análises
        </h1>
        <p className="text-sm text-laurelLeaf">
          Atividades registradas pelos usuários e quem domina mais território no momento.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className={`flex gap-1 rounded-lg border p-1 ${dark ? 'border-surfaceBorder bg-surface' : 'border-celeste bg-white'}`}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id)
                setPage(1)
              }}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                tab === id
                  ? 'bg-pear font-medium text-richBlack'
                  : dark
                    ? 'text-laurelLeaf hover:text-ceilingWhite'
                    : 'text-laurelLeaf hover:text-richBlack'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className={`flex gap-1 rounded-lg border p-1 ${dark ? 'border-surfaceBorder bg-surface' : 'border-celeste bg-white'}`}>
          {(['run', 'ride'] as ActivityTypeFilter[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setActivityType(type)
                setPage(1)
              }}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                activityType === type
                  ? 'bg-pear font-medium text-richBlack'
                  : dark
                    ? 'text-laurelLeaf hover:text-ceilingWhite'
                    : 'text-laurelLeaf hover:text-richBlack'
              }`}
            >
              {type === 'run' ? 'Corrida' : 'Pedal'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'activities' ? (
        <>
          {activitiesError && <p className="text-sm text-red-600">{activitiesError}</p>}

          {!summaryLoading && dailySummary.length > 0 && (
            <div className={`rounded-xl border p-4 ${dark ? 'border-surfaceBorder bg-surface' : 'border-celeste bg-white'}`}>
              <p className={`mb-2 text-sm font-medium ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>
                Distância total por dia (últimos 30 dias)
              </p>
              <ActivitiesChart data={dailySummary} dark={dark} />
            </div>
          )}

          {!activitiesLoading && activities.length === 0 ? (
            <EmptyState message="Nenhuma atividade registrada com esse filtro ainda." dark={dark} />
          ) : (
            <Table dark={dark}>
              <TableHead dark={dark}>
                <TableRow dark={dark}>
                  <TableCell className="font-medium">Usuário</TableCell>
                  <TableCell className="font-medium">Atividade</TableCell>
                  <TableCell className="font-medium">Distância</TableCell>
                  <TableCell className="font-medium">Duração</TableCell>
                  <TableCell className="font-medium">Território capturado</TableCell>
                  <TableCell className="font-medium">Loop fechado</TableCell>
                  <TableCell className="font-medium">Data</TableCell>
                  <TableCell className="font-medium">Ação</TableCell>
                </TableRow>
              </TableHead>
              <tbody>
                {activities.map((a) => (
                  <TableRow key={a.id} dark={dark}>
                    <TableCell>{a.userName}</TableCell>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{formatDistance(a.distanceMeters)}</TableCell>
                    <TableCell>{formatDuration(a.durationSeconds)}</TableCell>
                    <TableCell>
                      {a.captureM2 > 0 ? `${a.captureM2.toFixed(0)} m²` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        label={a.loopClosed ? 'Sim' : 'Não'}
                        tone={a.loopClosed ? 'success' : 'neutral'}
                      />
                    </TableCell>
                    <TableCell>{formatDateTime(a.createdAt)}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id, a.name)}
                        disabled={deletingId === a.id}
                        title="Apagar atividade (uso em teste)"
                        className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-laurelLeaf">
              <span>
                Página {pagination.page} de {pagination.totalPages} — {pagination.total} atividades
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-md border border-celeste p-1.5 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="rounded-md border border-celeste p-1.5 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {territoryError && <p className="text-sm text-red-600">{territoryError}</p>}

          {!territoryLoading && territoryRows.length > 0 && (
            <div className={`rounded-xl border p-4 ${dark ? 'border-surfaceBorder bg-surface' : 'border-celeste bg-white'}`}>
              <p className={`mb-2 text-sm font-medium ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>
                Top 10 — território dominado
              </p>
              <TerritoryDominanceChart data={territoryRows} dark={dark} />
            </div>
          )}

          {!territoryLoading && territoryRows.length === 0 ? (
            <EmptyState message="Ninguém capturou território ainda nesse tipo de atividade." dark={dark} />
          ) : (
            <Table dark={dark}>
              <TableHead dark={dark}>
                <TableRow dark={dark}>
                  <TableCell className="font-medium">#</TableCell>
                  <TableCell className="font-medium">Usuário</TableCell>
                  <TableCell className="font-medium">Território</TableCell>
                  <TableCell className="font-medium">Hexágonos</TableCell>
                </TableRow>
              </TableHead>
              <tbody>
                {territoryRows.map((r) => (
                  <TableRow key={r.userId} dark={dark}>
                    <TableCell>{r.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: r.color }}
                        />
                        {r.userName}
                      </div>
                    </TableCell>
                    <TableCell>{r.territoryKm2.toFixed(3)} km²</TableCell>
                    <TableCell>{r.cellsOwned}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  )
}
