import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { cases } from './mocks'
import { AntiCheatStatus } from '../../types'

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

export function AntiCheatPage() {
  const [selectedId, setSelectedId] = useState(cases[0].id)
  const selected = cases.find((c) => c.id === selectedId)!

  return (
    <div className="flex h-full gap-4">
      {/* Fila de casos */}
      <div className="flex w-80 shrink-0 flex-col gap-2 overflow-y-auto rounded-xl border border-celeste bg-white p-2">
        {cases.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`flex flex-col gap-1 rounded-lg p-3 text-left text-sm transition-colors ${
              c.id === selectedId ? 'bg-ceilingWhite' : 'hover:bg-ceilingWhite/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-richBlack">{c.user}</span>
              <Badge label={statusLabel[c.status]} tone={statusTone[c.status]} />
            </div>
            <span className="truncate text-xs text-laurelLeaf">{c.anomaly}</span>
            <span className="text-xs font-medium text-richBlack">Risco: {c.riskScore}</span>
          </button>
        ))}
      </div>

      {/* Painel de revisão */}
      <div className="flex flex-1 flex-col gap-4 rounded-xl border border-celeste bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-richBlack">{selected.user}</p>
            <p className="text-xs text-laurelLeaf">{selected.date}</p>
          </div>
          <Badge label={statusLabel[selected.status]} tone={statusTone[selected.status]} />
        </div>

        <p className="text-sm text-richBlack">{selected.anomaly}</p>

        {/* Placeholder do mapa com o trajeto GPS */}
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-celeste text-sm text-laurelLeaf">
          [ Mapa do trajeto GPS — placeholder ]
        </div>

        {/* Placeholder do gráfico de velocidade */}
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-celeste text-sm text-laurelLeaf">
          [ Gráfico de velocidade ao longo do percurso — placeholder ]
        </div>

        <div className="flex gap-2">
          <button className="rounded-lg bg-pear px-4 py-2 text-sm font-medium text-richBlack">
            Aprovar território
          </button>
          <button className="rounded-lg border border-celeste px-4 py-2 text-sm font-medium text-richBlack">
            Invalidar
          </button>
          <button className="rounded-lg border border-celeste px-4 py-2 text-sm font-medium text-richBlack">
            Advertir usuário
          </button>
          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">
            Banir
          </button>
        </div>
      </div>
    </div>
  )
}
