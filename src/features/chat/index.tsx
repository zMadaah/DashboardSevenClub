import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { useTickets } from './useTickets'
import { useMessages } from './useMessages'
import { formatDateTime } from '../../lib/format'
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

// Respostas prontas — texto estático de apoio, não é dado de negócio.
const quickReplies = [
  'Pode nos enviar um print do erro?',
  'Território indisponível pode levar até 5 min para atualizar — já verificou?',
  'Vamos escalar isso para a análise de anti-cheat.',
]

function avatarUrl(seed: string) {
  return `https://i.pravatar.cc/64?u=${seed}`
}

export function ChatPage() {
  const { tickets, isLoading, error } = useTickets()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, isLoading: messagesLoading, sending, send } = useMessages(selectedId)

  useEffect(() => {
    if (!selectedId && tickets.length > 0) {
      setSelectedId(tickets[0].id)
    }
  }, [tickets, selectedId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const selected = tickets.find((t) => t.id === selectedId)

  async function handleSend() {
    if (!draft.trim()) return
    await send(draft)
    setDraft('')
  }

  if (isLoading) {
    return <p className="text-sm text-laurelLeaf">Carregando...</p>
  }

  if (error) {
    return <p className="text-sm text-red-400">Não foi possível carregar: {error}</p>
  }

  if (tickets.length === 0) {
    return <EmptyState dark message="Nenhum ticket de suporte no momento." />
  }

  return (
    <div className="flex h-full gap-4">
      {/* Fila de conversas */}
      <div className="flex w-72 shrink-0 flex-col gap-2 overflow-y-auto rounded-xl border border-surfaceBorder bg-surface p-2">
        {tickets.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedId(t.id)}
            className={`flex items-start gap-3 rounded-lg p-3 text-left text-sm transition-colors ${
              t.id === selectedId ? 'bg-white/5' : 'hover:bg-white/5'
            }`}
          >
            <img
              src={avatarUrl(t.id)}
              alt={t.user}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-ceilingWhite">{t.user}</span>
                <Badge label={statusLabel[t.status]} tone={statusTone[t.status]} />
              </div>
              <span className="truncate text-xs text-laurelLeaf">{t.lastMessage}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Janela de conversa */}
      <div className="flex flex-1 flex-col rounded-xl border border-surfaceBorder bg-surface p-4">
        {selected && (
          <>
            <div className="mb-3 flex items-center gap-3 border-b border-white/5 pb-3">
              <img
                src={avatarUrl(selected.id)}
                alt={selected.user}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-ceilingWhite">{selected.user}</p>
                <p className="text-xs text-laurelLeaf">Atualizado {formatDateTime(selected.updatedAt)}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {messagesLoading ? (
                <p className="text-sm text-laurelLeaf">Carregando mensagens...</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === 'staff' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                          m.sender === 'staff' ? 'bg-pear text-richBlack' : 'bg-white/5 text-ceilingWhite'
                        }`}
                      >
                        {m.message}
                        <div className={`mt-1 text-[10px] ${m.sender === 'staff' ? 'text-richBlack/60' : 'text-laurelLeaf'}`}>
                          {formatDateTime(m.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2 border-t border-white/5 pt-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escrever uma resposta..."
                className="flex-1 rounded-lg border border-surfaceBorder bg-richBlack px-3 py-2 text-sm text-ceilingWhite outline-none placeholder:text-laurelLeaf/60 focus:border-pear"
              />
              <button
                onClick={handleSend}
                disabled={sending || !draft.trim()}
                className="flex items-center gap-2 rounded-lg bg-pear px-4 py-2 text-sm font-medium text-richBlack transition-colors hover:bg-pear/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={14} />
                Enviar
              </button>
            </div>
          </>
        )}
      </div>

      {/* Respostas rápidas */}
      <div className="flex w-64 shrink-0 flex-col gap-2 rounded-xl border border-surfaceBorder bg-surface p-4">
        <p className="mb-1 text-xs font-medium uppercase text-laurelLeaf">Respostas rápidas</p>
        {quickReplies.map((r) => (
          <button
            key={r}
            onClick={() => setDraft(r)}
            className="rounded-lg border border-surfaceBorder px-3 py-2 text-left text-xs text-ceilingWhite transition-colors hover:bg-white/5"
          >
            {r}
          </button>
        ))}
        <button className="mt-2 rounded-lg border border-surfaceBorder bg-white/5 px-3 py-2 text-xs font-medium text-ceilingWhite transition-colors hover:bg-white/10">
          Escalar para anti-cheat
        </button>
      </div>
    </div>
  )
}