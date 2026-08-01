import { useState } from 'react'
import { Send, Clock } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { notificationHistory, audienceLabel, estimatedReach } from './mocks'
import { NotificationAudience, NotificationStatus, NotificationRecord } from './types'

const audienceOptions: { value: NotificationAudience; label: string }[] = [
  { value: 'all', label: 'Todos os usuários' },
  { value: 'subscribers', label: 'Assinantes' },
  { value: 'free', label: 'Free' },
  { value: 'cancelled', label: 'Cancelados' },
  { value: 'inactive', label: 'Usuários inativos' },
]

const statusTone: Record<NotificationStatus, 'success' | 'warning' | 'neutral'> = {
  sent: 'success',
  scheduled: 'warning',
  draft: 'neutral',
}

const statusLabel: Record<NotificationStatus, string> = {
  sent: 'Enviada',
  scheduled: 'Agendada',
  draft: 'Rascunho',
}

const inputClass =
  'w-full rounded-lg border border-surfaceBorder bg-richBlack px-3 py-2 text-sm text-ceilingWhite outline-none placeholder:text-laurelLeaf/60 focus:border-pear'
const activeToggle = 'rounded-md bg-pear px-3 py-1.5 text-sm font-medium text-richBlack'
const inactiveToggle =
  'rounded-md border border-surfaceBorder px-3 py-1.5 text-sm font-medium text-laurelLeaf transition-colors hover:text-ceilingWhite'

export function NotificationsPage() {
  const [history, setHistory] = useState<NotificationRecord[]>(notificationHistory)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState<NotificationAudience>('all')
  const [sendMode, setSendMode] = useState<'now' | 'schedule'>('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  async function handleSend() {
    if (!title.trim() || !message.trim()) {
      setFeedback('Preencha título e mensagem antes de enviar.')
      return
    }
    if (sendMode === 'schedule' && (!scheduleDate || !scheduleTime)) {
      setFeedback('Escolha data e hora para agendar.')
      return
    }

    setSending(true)
    setFeedback(null)
    // Simula o envio até existir uma API real (POST /notifications).
    await new Promise((resolve) => setTimeout(resolve, 600))

    const record: NotificationRecord = {
      id: `ntf_${Math.random().toString(36).slice(2, 8)}`,
      title,
      message,
      audience,
      status: sendMode === 'now' ? 'sent' : 'scheduled',
      reach: estimatedReach[audience],
      date: sendMode === 'now' ? 'agora mesmo' : `${scheduleDate} ${scheduleTime}`,
    }

    setHistory((prev) => [record, ...prev])
    setSending(false)
    setFeedback(sendMode === 'now' ? 'Notificação enviada!' : 'Notificação agendada!')
    setTitle('')
    setMessage('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Card dark className="col-span-2">
          <h2 className="text-sm font-medium text-ceilingWhite">Nova notificação</h2>
          <p className="mb-4 text-xs text-laurelLeaf">Envie um push para os usuários do app</p>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ceilingWhite">Título</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={50}
                placeholder="Ex: Novo desafio disponível!"
                className={inputClass}
              />
              <span className="text-right text-[10px] text-laurelLeaf">{title.length}/50</span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ceilingWhite">Mensagem</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={150}
                rows={3}
                placeholder="Escreva a mensagem que vai aparecer na notificação..."
                className={`${inputClass} resize-none`}
              />
              <span className="text-right text-[10px] text-laurelLeaf">{message.length}/150</span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ceilingWhite">Público-alvo</span>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as NotificationAudience)}
                className={`${inputClass} appearance-none`}
              >
                {audienceOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-laurelLeaf">
                Alcance estimado: {estimatedReach[audience].toLocaleString('pt-BR')} usuários
              </span>
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ceilingWhite">Quando enviar</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSendMode('now')}
                  className={sendMode === 'now' ? activeToggle : inactiveToggle}
                >
                  Agora
                </button>
                <button
                  type="button"
                  onClick={() => setSendMode('schedule')}
                  className={sendMode === 'schedule' ? activeToggle : inactiveToggle}
                >
                  Agendar
                </button>
              </div>
              {sendMode === 'schedule' && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            {feedback && <p className="text-sm text-pear">{feedback}</p>}

            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="flex items-center justify-center gap-2 rounded-lg bg-pear px-4 py-2 text-sm font-medium text-richBlack transition-colors hover:bg-pear/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sendMode === 'now' ? <Send size={14} /> : <Clock size={14} />}
              {sending ? 'Enviando...' : sendMode === 'now' ? 'Enviar agora' : 'Agendar notificação'}
            </button>
          </div>
        </Card>

        <Card dark>
          <h2 className="mb-4 text-sm font-medium text-ceilingWhite">Pré-visualização</h2>
          <div className="rounded-2xl bg-black/30 p-4">
            <div className="flex items-start gap-3 rounded-xl bg-white/95 p-3 shadow-lg">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pear text-xs font-bold text-richBlack">
                7C
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-richBlack">Seven Club</span>
                  <span className="text-[10px] text-laurelLeaf">agora</span>
                </div>
                <p className="truncate text-sm font-medium text-richBlack">
                  {title || 'Título da notificação'}
                </p>
                <p className="line-clamp-2 text-xs text-laurelLeaf">
                  {message || 'A mensagem aparece aqui conforme você digita...'}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-laurelLeaf">
            Assim é como a notificação aparece na tela de bloqueio do usuário.
          </p>
        </Card>
      </div>

      <Card dark>
        <h2 className="mb-4 text-sm font-medium text-ceilingWhite">Histórico</h2>
        <div className="flex flex-col divide-y divide-white/5">
          {history.map((n) => (
            <div key={n.id} className="flex items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ceilingWhite">{n.title}</p>
                <p className="truncate text-xs text-laurelLeaf">{n.message}</p>
              </div>
              <span className="w-36 shrink-0 text-xs text-laurelLeaf">{audienceLabel[n.audience]}</span>
              <span className="w-24 shrink-0 text-xs text-laurelLeaf">
                {n.reach.toLocaleString('pt-BR')} alcance
              </span>
              <Badge label={statusLabel[n.status]} tone={statusTone[n.status]} />
              <span className="w-36 shrink-0 text-right text-xs text-laurelLeaf">{n.date}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}