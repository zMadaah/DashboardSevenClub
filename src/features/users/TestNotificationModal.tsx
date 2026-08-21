import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { sendTestNotification } from './api'
import { useAuth } from '../../auth/AuthContext'
import { SupportUser } from './types'

interface TestNotificationModalProps {
  user: SupportUser
  onClose: () => void
  dark: boolean
}

export function TestNotificationModal({ user, onClose, dark }: TestNotificationModalProps) {
  const { token } = useAuth()
  const [title, setTitle] = useState('Seven Club')
  const [body, setBody] = useState('Essa é uma notificação de teste enviada pelo dashboard.')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-pear ${
    dark ? 'border-surfaceBorder bg-richBlack text-ceilingWhite' : 'border-celeste bg-white text-richBlack'
  }`
  const textPrimary = dark ? 'text-ceilingWhite' : 'text-richBlack'

  async function handleSend() {
    setSending(true)
    setResult(null)
    try {
      await sendTestNotification(user.id, title, body, token)
      setResult({ ok: true, message: `Notificação enviada para ${user.firstName || user.username}.` })
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : 'Não foi possível enviar.',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`w-full max-w-sm rounded-xl border p-5 ${dark ? 'border-surfaceBorder bg-surface' : 'border-celeste bg-white'}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={`text-sm font-semibold ${textPrimary}`}>
            Testar notificação — {user.firstName || user.username}
          </h2>
          <button onClick={onClose} className="text-laurelLeaf hover:text-current">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs text-laurelLeaf">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-xs text-laurelLeaf">Mensagem</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>

          {result && (
            <p className={`text-xs ${result.ok ? 'text-green-500' : 'text-red-500'}`}>{result.message}</p>
          )}

          <button
            onClick={handleSend}
            disabled={sending || !title.trim() || !body.trim()}
            className="flex items-center justify-center gap-2 rounded-lg bg-pear px-4 py-2 text-sm font-medium text-richBlack transition-colors hover:bg-pear/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={14} />
            {sending ? 'Enviando...' : 'Enviar notificação de teste'}
          </button>

          <p className="text-[11px] text-laurelLeaf">
            Só funciona se esse usuário já tiver aberto o app com permissão de notificação
            concedida — sem isso, não existe token registrado pra receber.
          </p>
        </div>
      </div>
    </div>
  )
}
