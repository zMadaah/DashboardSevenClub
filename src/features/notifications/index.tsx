import { useEffect, useState } from 'react'
import { Send, Search, Loader2, Bell } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { useTheme } from '../../theme/ThemeContext'
import { useAuth } from '../../auth/AuthContext'
import { formatDateTime } from '../../lib/format'
import { listUsers, sendTestNotification } from '../users/api'
import { SupportUser } from '../users/types'
import { getNotificationsHistory, NotificationHistoryItem } from './api'
import { ApiError } from '../../lib/api'

const CATEGORY_LABEL: Record<string, string> = {
  territory: 'Território',
  invite: 'Convite',
  community: 'Comunidade',
  sevenclub: 'Seven Club',
}

const CATEGORY_TONE: Record<string, 'success' | 'warning' | 'neutral'> = {
  territory: 'warning',
  invite: 'success',
  community: 'neutral',
  sevenclub: 'neutral',
}

export function NotificationsPage() {
  const { theme } = useTheme()
  const { token } = useAuth()
  const dark = theme === 'dark'
  const textPrimary = dark ? 'text-ceilingWhite' : 'text-richBlack'
  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm outline-none placeholder:text-laurelLeaf/60 focus:border-pear ${
    dark ? 'border-surfaceBorder bg-richBlack text-ceilingWhite' : 'border-celeste bg-ceilingWhite text-richBlack'
  }`

  // --- Testar com um usuário específico — POST /notifications/send-test
  // real. Único jeito de disparar notificação por aqui hoje — não existe
  // envio em massa de verdade (precisaria de uma rota staff nova que
  // filtre público-alvo, o que arriscaria conflitar com o time de
  // suporte se qualquer staff pudesse disparar pra todo mundo sem
  // controle — por isso foi removido daqui, não substituído).
  const [testQuery, setTestQuery] = useState('')
  const [testResults, setTestResults] = useState<SupportUser[]>([])
  const [searchingTestUser, setSearchingTestUser] = useState(false)
  const [testUser, setTestUser] = useState<SupportUser | null>(null)
  const [testTitle, setTestTitle] = useState('Seven Club')
  const [testBody, setTestBody] = useState('Essa é uma notificação de teste enviada pelo dashboard.')
  const [testSending, setTestSending] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)

  // --- Histórico real (antes era mock local, nunca buscava do backend)
  const [history, setHistory] = useState<NotificationHistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)

  function loadHistory() {
    setHistoryLoading(true)
    getNotificationsHistory(1, token)
      .then((res) => setHistory(res.notifications))
      .catch((err: unknown) => setHistoryError(err instanceof ApiError ? err.message : 'Erro ao carregar'))
      .finally(() => setHistoryLoading(false))
  }

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    if (testQuery.trim().length < 2 || testUser) {
      setTestResults([])
      return
    }
    let cancelled = false
    setSearchingTestUser(true)
    const timeout = setTimeout(() => {
      listUsers({ query: testQuery, page: 1, pageSize: 5 }, token)
        .then((result) => {
          if (!cancelled) setTestResults(result.users)
        })
        .catch(() => {
          if (!cancelled) setTestResults([])
        })
        .finally(() => {
          if (!cancelled) setSearchingTestUser(false)
        })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [testQuery, testUser, token])

  async function handleSendTest() {
    if (!testUser) return
    setTestSending(true)
    setTestResult(null)
    try {
      await sendTestNotification(testUser.id, testTitle, testBody, token)
      setTestResult({ ok: true, message: `Notificação enviada para ${testUser.firstName || testUser.username}.` })
      // recarrega o histórico — o envio de teste já grava lá também
      loadHistory()
    } catch (err) {
      setTestResult({
        ok: false,
        message: err instanceof Error ? err.message : 'Não foi possível enviar.',
      })
    } finally {
      setTestSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className={`text-xl font-semibold ${textPrimary}`}>Notificações</h1>
        <p className="text-sm text-laurelLeaf">
          Teste o envio pra uma pessoa específica, e acompanhe o que já foi entregue
        </p>
      </div>

      <Card dark={dark}>
        <div className="mb-1 flex items-center gap-2">
          <h2 className={`text-sm font-medium ${textPrimary}`}>Testar com um usuário</h2>
          <Badge label="Real" tone="success" />
        </div>
        <p className="mb-4 text-xs text-laurelLeaf">
          Envia de verdade, direto pro celular de uma pessoa específica.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className={`text-sm font-medium ${textPrimary}`}>Usuário</span>
              {testUser ? (
                <div
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                    dark ? 'border-surfaceBorder bg-richBlack' : 'border-celeste bg-ceilingWhite'
                  }`}
                >
                  <span className={textPrimary}>
                    {testUser.firstName || testUser.username} — {testUser.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTestUser(null)
                      setTestQuery('')
                      setTestResult(null)
                    }}
                    className="text-xs text-laurelLeaf hover:text-current"
                  >
                    Trocar
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-laurelLeaf" />
                  <input
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    placeholder="Busca por nome, usuário ou e-mail..."
                    className={`${inputClass} pl-8`}
                  />
                  {searchingTestUser && (
                    <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-laurelLeaf" />
                  )}
                  {testResults.length > 0 && (
                    <div
                      className={`absolute z-10 mt-1 w-full overflow-hidden rounded-lg border shadow-lg ${
                        dark ? 'border-surfaceBorder bg-surface' : 'border-celeste bg-white'
                      }`}
                    >
                      {testResults.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setTestUser(u)
                            setTestResults([])
                          }}
                          className={`block w-full px-3 py-2 text-left text-sm hover:bg-pear/10 ${textPrimary}`}
                        >
                          {u.firstName || u.username} <span className="text-xs text-laurelLeaf">— {u.email}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className={`text-sm font-medium ${textPrimary}`}>Título</span>
              <input value={testTitle} onChange={(e) => setTestTitle(e.target.value)} className={inputClass} />
            </label>
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <span className={`text-sm font-medium ${textPrimary}`}>Mensagem</span>
            <textarea
              value={testBody}
              onChange={(e) => setTestBody(e.target.value)}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {testResult && (
          <p className={`mt-3 text-xs ${testResult.ok ? 'text-green-500' : 'text-red-500'}`}>{testResult.message}</p>
        )}

        <button
          type="button"
          onClick={handleSendTest}
          disabled={!testUser || testSending || !testTitle.trim() || !testBody.trim()}
          className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-pear px-4 py-2 text-sm font-medium text-pear transition-colors hover:bg-pear/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={14} />
          {testSending ? 'Enviando...' : 'Enviar notificação de teste'}
        </button>

        <p className="mt-2 text-[11px] text-laurelLeaf">
          Só funciona se esse usuário já tiver aberto o app com permissão de notificação
          concedida — sem isso, não existe token registrado, mas fica salva no histórico
          dela mesmo assim.
        </p>
      </Card>

      <Card dark={dark}>
        <h2 className={`mb-4 text-sm font-medium ${textPrimary}`}>Histórico</h2>

        {historyLoading ? (
          <p className="text-sm text-laurelLeaf">Carregando...</p>
        ) : historyError ? (
          <p className="text-sm text-red-500">{historyError}</p>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Bell size={24} className="text-laurelLeaf" />
            <p className="text-sm text-laurelLeaf">Nenhuma notificação enviada ainda.</p>
          </div>
        ) : (
          <div className={`flex flex-col divide-y ${dark ? 'divide-white/5' : 'divide-celeste'}`}>
            {history.map((n) => (
              <div key={n.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${textPrimary}`}>{n.title}</p>
                  <p className="truncate text-xs text-laurelLeaf">{n.subtitle}</p>
                </div>
                <span className="w-36 shrink-0 text-xs text-laurelLeaf">{n.recipientName}</span>
                <Badge label={CATEGORY_LABEL[n.category] ?? n.category} tone={CATEGORY_TONE[n.category] ?? 'neutral'} />
                <span className="w-36 shrink-0 text-right text-xs text-laurelLeaf">{formatDateTime(n.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
