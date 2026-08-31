import { useEffect, useState } from 'react'
import { RotateCcw, AlertTriangle, Calendar } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../auth/AuthContext'
import { useTheme } from '../../theme/ThemeContext'
import { formatDateTime } from '../../lib/format'
import { getCurrentSeason, resetSeason, SeasonInfo } from './api'
import { ApiError } from '../../lib/api'

export function SeasonPage() {
  const { token } = useAuth()
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const textPrimary = dark ? 'text-ceilingWhite' : 'text-richBlack'
  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-pear ${
    dark ? 'border-surfaceBorder bg-richBlack text-ceilingWhite' : 'border-celeste bg-white text-richBlack'
  }`

  const [season, setSeason] = useState<SeasonInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmInput, setConfirmInput] = useState('')
  const [resetting, setResetting] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    loadSeason()
  }, [])

  function loadSeason() {
    setLoading(true)
    getCurrentSeason(token)
      .then(setSeason)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }

  const confirmMatches = season !== null && confirmInput.trim() === String(season.number)

  async function handleReset() {
    if (!confirmMatches) return
    setResetting(true)
    setResult(null)
    try {
      const res = await resetSeason(token)
      setResult(
        `Temporada ${res.previousSeasonNumber} encerrada — Temporada ${res.newSeasonNumber} já está valendo.`
      )
      setConfirmOpen(false)
      setConfirmInput('')
      loadSeason()
    } catch (err) {
      setResult(err instanceof ApiError ? err.message : 'Não foi possível resetar a temporada.')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className={`text-xl font-semibold ${textPrimary}`}>Temporada</h1>
        <p className="text-sm text-laurelLeaf">Ciclo de nível, insígnias e território — reinicia a cada 3 meses</p>
      </div>

      <Card dark={dark}>
        {loading ? (
          <p className="text-sm text-laurelLeaf">Carregando...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : season ? (
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${dark ? 'bg-richBlack' : 'bg-ceilingWhite'}`}>
              <Calendar size={20} className="text-pear" />
            </div>
            <div>
              <h2 className={`text-base font-semibold ${textPrimary}`}>{season.name}</h2>
              <p className="text-xs text-laurelLeaf">
                {formatDateTime(season.startsAt)} até {formatDateTime(season.endsAt)}
              </p>
            </div>
          </div>
        ) : null}
      </Card>

      <Card dark={dark}>
        <div className="mb-1 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          <h2 className={`text-sm font-medium ${textPrimary}`}>Resetar temporada</h2>
        </div>
        <p className="mb-4 text-xs text-laurelLeaf">
          Zera o nível/XP e o território de TODOS os usuários (insígnias por temporada já resetam
          sozinhas). Os resultados finais de quem participou ficam arquivados antes do reset — não
          é possível desfazer essa ação depois de confirmada.
        </p>

        {!confirmOpen ? (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
          >
            <RotateCcw size={14} />
            Resetar temporada
          </button>
        ) : (
          <div className={`rounded-lg border p-4 ${dark ? 'border-red-500/40 bg-red-500/5' : 'border-red-300 bg-red-50'}`}>
            <p className={`mb-3 text-sm font-medium ${textPrimary}`}>
              Pra confirmar, digite <strong>{season?.number}</strong> (o número da temporada atual):
            </p>
            <input
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className={inputClass}
              placeholder={String(season?.number ?? '')}
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={!confirmMatches || resetting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {resetting ? 'Resetando...' : 'Confirmar reset'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false)
                  setConfirmInput('')
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-medium ${dark ? 'border-surfaceBorder text-ceilingWhite' : 'border-celeste text-richBlack'}`}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {result && <p className={`mt-3 text-xs ${textPrimary}`}>{result}</p>}
      </Card>
    </div>
  )
}
