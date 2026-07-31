import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { tickets, quickReplies } from './mocks'
import { TicketStatus } from '../../types'

const statusTone: Record<TicketStatus, 'warning' | 'neutral' | 'success'> = {
  new: 'warning',
  in_progress: 'neutral',
  resolved: 'success',
}

const statusLabel: Record<TicketStatus, string> = {
  new: 'Novo',
  in_progress: 'Em andamento',
  resolved: 'Resolvido',
}

// Fotos de placeholder (pravatar.cc), determinísticas pelo id do ticket.
// Quando a API real existir, trocar por user.avatarUrl vindo do backend.
function avatarUrl(seed: string) {
  return `https://i.pravatar.cc/64?u=${seed}`
}

export function ChatPage() {
  const [selectedId, setSelectedId] = useState(tickets[0].id)
  const selected = tickets.find((t) => t.id === selectedId)!

  return (
    <div className="flex h-full gap-4">
      {/* Fila de conversas */}
      <div className="flex w-72 shrink-0 flex-col gap-2 overflow-y-auto rounded-xl border border-celeste bg-white p-2">
        {tickets.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedId(t.id)}
            className={`flex items-start gap-3 rounded-lg p-3 text-left text-sm transition-colors ${
              t.id === selectedId ? 'bg-ceilingWhite' : 'hover:bg-ceilingWhite/60'
            }`}
          >
            <img
              src={avatarUrl(t.id)}
              alt={t.user}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-richBlack">{t.user}</span>
                <Badge label={statusLabel[t.status]} tone={statusTone[t.status]} />
              </div>
              <span className="truncate text-xs text-laurelLeaf">{t.lastMessage}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Janela de conversa */}
      <div className="flex flex-1 flex-col rounded-xl border border-celeste bg-white p-4">
        <div className="mb-3 flex items-center gap-3 border-b border-celeste pb-3">
          <img
            src={avatarUrl(selected.id)}
            alt={selected.user}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-richBlack">{selected.user}</p>
            <p className="text-xs text-laurelLeaf">Atualizado {selected.updatedAt}</p>
          </div>
        </div>
        <div className="flex-1 text-sm text-laurelLeaf">
          {selected.lastMessage}
        </div>
        <div className="mt-3 flex gap-2 border-t border-celeste pt-3">
          <input
            placeholder="Escrever uma resposta..."
            className="flex-1 rounded-lg border border-celeste px-3 py-2 text-sm outline-none focus:border-richBlack"
          />
          <button className="rounded-lg bg-pear px-4 py-2 text-sm font-medium text-richBlack">
            Enviar
          </button>
        </div>
      </div>

      {/* Respostas rápidas */}
      <div className="flex w-64 shrink-0 flex-col gap-2 rounded-xl border border-celeste bg-white p-4">
        <p className="mb-1 text-xs font-medium uppercase text-laurelLeaf">Respostas rápidas</p>
        {quickReplies.map((r) => (
          <button
            key={r}
            className="rounded-lg border border-celeste px-3 py-2 text-left text-xs text-richBlack hover:bg-ceilingWhite"
          >
            {r}
          </button>
        ))}
        <button className="mt-2 rounded-lg bg-richBlack px-3 py-2 text-xs font-medium text-ceilingWhite">
          Escalar para anti-cheat
        </button>
      </div>
    </div>
  )
}