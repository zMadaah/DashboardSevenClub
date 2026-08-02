import { useEffect, useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { useAntiCheatFlags } from './useAntiCheatFlags'
import { updateFlagStatus } from './api'
import { useAuth } from '../../auth/AuthContext'
import { formatDateTime } from '../../lib/format'
import { AntiCheatStatus } from '../../types'
import { ActivityRoute } from './types'

const statusTone: Record<AntiCheatStatus, 'warning' | 'success' | 'danger' | 'neutral'> = {
  pending: 'warning',
  approved: 'success',
  invalidated: 'danger',
  warned: 'neutral',
  banned: 'danger',
}

const statusLabel: Record<AntiCheatStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  invalidated: 'Invalidado',
  warned: 'Advertido',
  banned: 'Banido',
}

// Converte as coordenadas [lng, lat] do trajeto num viewBox de SVG simples,
// só pra dar uma visão rápida do formato do percurso — não é um mapa real
// (sem tiles/ruas), mas já é dado de verdade, não mais placeholder.
function routeToPoints(coordinates: [number, number][], width = 300, height = 200, padding = 20) {
  const lons = coordinates.map((c) => c[0])
  const lats = coordinates.map((c) => c[1])
  const minLon = Math.min(...lons)
  const maxLon = Math.max(...lons)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const lonRange = maxLon - minLon || 1
  const latRange = maxLat - minLat || 1

  return coordinates
    .map(([lon, lat]) => {
      const x = padding + ((lon - minLon) / lonRange) * (width - padding * 2)
      const y = height - padding - ((lat - minLat) / latRange) * (height - padding * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function RouteSvg({ route }: { route: ActivityRoute | null }) {
  if (!route || route.coordinates.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-laurelLeaf">
        Trajeto não disponível
      </div>
    )
  }

  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 300 200" className="h-full w-full">
        <polyline
          points={routeToPoints(route.coordinates)}
          fill="none"
          stroke="#BCFF00"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function AntiCheatPage() {
  const { token } = useAuth()
  const { cases, isLoading, error, refetch } = useAntiCheatFlags()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!selectedId && cases.length > 0) {
      setSelectedId(cases[0].id)
    }
  }, [cases, selectedId])

  const selected = cases.find((c) => c.id === selectedId)

  async function handleAction(status: AntiCheatStatus) {
    if (!selected) return
    setActionError(null)
    setUpdating(true)
    try {
      await updateFlagStatus(selected.id, status, token)
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível atualizar a flag.')
    } finally {
      setUpdating(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-laurelLeaf">Carregando...</p>
  }

  if (error) {
    return <p className="text-sm text-red-400">Não foi possível carregar: {error}</p>
  }

  if (cases.length === 0) {
    return <EmptyState dark message="Nenhuma flag de anti-cheat no momento." />
  }

  const avgSpeedKmh = selected
    ? selected.activity.distanceMeters / 1000 / (selected.activity.durationSeconds / 3600)
    : 0

  return (
    <div className="flex h-full gap-4">
      {/* Fila de casos */}
      <div className="flex w-80 shrink-0 flex-col gap-2 overflow-y-auto rounded-xl border border-surfaceBorder bg-surface p-2">
        {cases.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`flex flex-col gap-1 rounded-lg p-3 text-left text-sm transition-colors ${
              c.id === selectedId ? 'bg-white/5' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-ceilingWhite">{c.user}</span>
              <Badge label={statusLabel[c.status]} tone={statusTone[c.status]} />
            </div>
            <span className="truncate text-xs text-laurelLeaf">{c.anomaly}</span>
            <span className="text-xs font-medium text-ceilingWhite">Risco: {c.riskScore}</span>
          </button>
        ))}
      </div>

      {/* Painel de revisão */}
      {selected && (
        <div className="flex flex-1 flex-col gap-4 rounded-xl border border-surfaceBorder bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-ceilingWhite">{selected.user}</p>
              <p className="text-xs text-laurelLeaf">{formatDateTime(selected.date)}</p>
            </div>
            <Badge label={statusLabel[selected.status]} tone={statusTone[selected.status]} />
          </div>

          <p className="text-sm text-ceilingWhite">{selected.anomaly}</p>

          <RouteSvg route={selected.activity.route} />

          <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-center">
            <div>
              <p className="text-xs text-laurelLeaf">Distância</p>
              <p className="text-lg font-semibold text-ceilingWhite">
                {(selected.activity.distanceMeters / 1000).toFixed(2)} km
              </p>
            </div>
            <div>
              <p className="text-xs text-laurelLeaf">Duração</p>
              <p className="text-lg font-semibold text-ceilingWhite">
                {Math.round(selected.activity.durationSeconds / 60)} min
              </p>
            </div>
            <div>
              <p className="text-xs text-laurelLeaf">Velocidade média</p>
              <p className="text-lg font-semibold text-pear">{avgSpeedKmh.toFixed(1)} km/h</p>
            </div>
          </div>

          {actionError && <p className="text-sm text-red-400">{actionError}</p>}

          <div className="flex gap-2">
            <button
              onClick={() => handleAction('approved')}
              disabled={updating}
              className="rounded-lg bg-pear px-4 py-2 text-sm font-medium text-richBlack transition-colors hover:bg-pear/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Aprovar território
            </button>
            <button
              onClick={() => handleAction('invalidated')}
              disabled={updating}
              className="rounded-lg border border-surfaceBorder px-4 py-2 text-sm font-medium text-ceilingWhite transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Invalidar
            </button>
            <button
              onClick={() => handleAction('warned')}
              disabled={updating}
              className="rounded-lg border border-surfaceBorder px-4 py-2 text-sm font-medium text-ceilingWhite transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Advertir usuário
            </button>
            <button
              onClick={() => handleAction('banned')}
              disabled={updating}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Banir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}