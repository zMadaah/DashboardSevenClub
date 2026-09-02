import { useEffect, useState } from 'react'
import { Flag, MessageSquare, FileText } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { useAuth } from '../../auth/AuthContext'
import { useTheme } from '../../theme/ThemeContext'
import { formatDateTime } from '../../lib/format'
import { getReports, updateReportStatus, Report, ReportStatus } from './api'
import { ApiError } from '../../lib/api'

const STATUS_TABS: { value: ReportStatus | 'all'; label: string }[] = [
  { value: 'pending', label: 'Pendentes' },
  { value: 'reviewed', label: 'Revisadas' },
  { value: 'dismissed', label: 'Descartadas' },
  { value: 'all', label: 'Todas' },
]

const STATUS_TONE: Record<ReportStatus, 'warning' | 'success' | 'neutral'> = {
  pending: 'warning',
  reviewed: 'success',
  dismissed: 'neutral',
}

const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: 'Pendente',
  reviewed: 'Revisada',
  dismissed: 'Descartada',
}

export function ReportsPage() {
  const { token } = useAuth()
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const textPrimary = dark ? 'text-ceilingWhite' : 'text-richBlack'

  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('pending')
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [statusFilter])

  function load() {
    setLoading(true)
    getReports(statusFilter, token)
      .then((res) => setReports(res.reports))
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }

  async function handleAction(id: string, status: 'reviewed' | 'dismissed') {
    setActingId(id)
    try {
      await updateReportStatus(id, status, token)
      // remove da lista local em vez de recarregar tudo — mais rápido,
      // e evita perder a posição de scroll no meio de uma fila longa
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível atualizar.')
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className={`text-xl font-semibold ${textPrimary}`}>Denúncias</h1>
        <p className="text-sm text-laurelLeaf">Posts e comentários denunciados por usuários do app</p>
      </div>

      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? 'bg-pear text-richBlack'
                : dark
                  ? 'bg-surface text-ceilingWhite/70'
                  : 'bg-ceilingWhite text-richBlack/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Card dark={dark}>
          <p className="text-sm text-laurelLeaf">Carregando...</p>
        </Card>
      ) : error ? (
        <Card dark={dark}>
          <p className="text-sm text-red-500">{error}</p>
        </Card>
      ) : reports.length === 0 ? (
        <Card dark={dark}>
          <p className="text-sm text-laurelLeaf">Nenhuma denúncia nessa categoria.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <Card key={report.id} dark={dark}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {report.targetType === 'post' ? (
                      <FileText size={14} className="text-laurelLeaf" />
                    ) : (
                      <MessageSquare size={14} className="text-laurelLeaf" />
                    )}
                    <span className="text-xs text-laurelLeaf">
                      {report.targetType === 'post' ? 'Post' : 'Comentário'} de{' '}
                      <strong className={textPrimary}>
                        {report.contentAuthorName ?? 'conta removida'}
                      </strong>
                    </span>
                    <Badge label={STATUS_LABEL[report.status]} tone={STATUS_TONE[report.status]} />
                  </div>

                  <p className={`mb-2 text-sm ${textPrimary}`}>
                    {report.contentText ?? (
                      <span className="italic text-laurelLeaf">
                        Conteúdo removido — já não existe mais no app.
                      </span>
                    )}
                  </p>

                  <p className="flex items-center gap-1 text-xs text-laurelLeaf">
                    <Flag size={12} />
                    Denunciado por {report.reporterName} — {formatDateTime(report.createdAt)}
                  </p>
                </div>

                {report.status === 'pending' && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={actingId === report.id}
                      onClick={() => handleAction(report.id, 'dismissed')}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium disabled:opacity-40 ${
                        dark ? 'border-surfaceBorder text-ceilingWhite' : 'border-celeste text-richBlack'
                      }`}
                    >
                      Descartar
                    </button>
                    <button
                      type="button"
                      disabled={actingId === report.id}
                      onClick={() => handleAction(report.id, 'reviewed')}
                      className="rounded-lg bg-pear px-3 py-1.5 text-xs font-medium text-richBlack disabled:opacity-40"
                    >
                      Marcar revisada
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
