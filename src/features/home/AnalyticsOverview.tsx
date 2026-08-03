import { Activity, Users, Percent, Clock } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '../../components/ui/Card'
import { useTheme } from '../../theme/ThemeContext'
import { useAnalyticsOverview } from './useAnalyticsOverview'
import { StatusCounts } from './analyticsApi'

const statIcons = [Activity, Users, Percent, Clock]

const eventStatusLabel: Record<string, string> = {
  scheduled: 'Agendado',
  live: 'Ao vivo',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
}

const antiCheatStatusLabel: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  invalidated: 'Invalidado',
  warned: 'Advertido',
  banned: 'Banido',
}

function StatusBars({
  counts,
  labels,
  dark,
}: {
  counts: StatusCounts
  labels: Record<string, string>
  dark: boolean
}) {
  const entries = Object.entries(counts)
  const max = Math.max(1, ...entries.map(([, value]) => value))
  const textPrimary = dark ? 'text-ceilingWhite' : 'text-richBlack'

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([key, value]) => (
        <div key={key} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className={textPrimary}>{labels[key] ?? key}</span>
            <span className={`font-medium ${textPrimary}`}>{value}</span>
          </div>
          <div className={`h-1.5 w-full rounded-full ${dark ? 'bg-white/10' : 'bg-celeste'}`}>
            <div className="h-1.5 rounded-full bg-pear" style={{ width: `${(value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsOverview() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const textPrimary = dark ? 'text-ceilingWhite' : 'text-richBlack'
  const { data, isLoading, error } = useAnalyticsOverview()

  const gridStroke = dark ? '#1C3333' : '#D2D3CE'
  const axisStroke = '#96998C'
  const tooltipStyle = dark
    ? { background: '#0E2222', borderColor: '#1C3333', borderRadius: 8, fontSize: 12, color: '#E9EBE6' }
    : { background: '#FFFFFF', borderColor: '#D2D3CE', borderRadius: 8, fontSize: 12, color: '#061414' }

  if (isLoading) {
    return <p className="text-sm text-laurelLeaf">Carregando...</p>
  }

  if (error || !data) {
    return <p className="text-sm text-red-400">Não foi possível carregar: {error}</p>
  }

  const statCards = [
    { label: 'Atividades esta semana', value: String(data.stats.activitiesThisWeek) },
    { label: 'Usuários ativos esta semana', value: String(data.stats.activeUsersThisWeek) },
    { label: 'Taxa de cancelamento', value: `${data.stats.cancellationRate}%` },
    {
      label: 'Tempo médio de resposta',
      value: data.stats.avgResponseMinutes !== null ? `${data.stats.avgResponseMinutes} min` : 'Sem dados',
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Card dark={dark}>
        <h2 className={`text-sm font-medium ${textPrimary}`}>Atividade semanal</h2>
        <p className="mb-4 text-xs text-laurelLeaf">Corridas/pedaladas e territórios capturados por dia</p>

        <div className="mb-3 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-laurelLeaf">
            <span className="h-2 w-2 rounded-full bg-pear" /> Atividades
          </span>
          <span className="flex items-center gap-1.5 text-laurelLeaf">
            <span className="h-2 w-2 rounded-full bg-laurelLeaf" /> Territórios capturados
          </span>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.weeklyActivity} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="activitiesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BCFF00" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#BCFF00" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="territoriesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#96998C" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#96998C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="day" stroke={axisStroke} tickLine={false} axisLine={false} fontSize={12} />
            <YAxis stroke={axisStroke} tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="activities"
              name="Atividades"
              stroke="#BCFF00"
              strokeWidth={2}
              fill="url(#activitiesGradient)"
            />
            <Area
              type="monotone"
              dataKey="territories"
              name="Territórios capturados"
              stroke="#96998C"
              strokeWidth={2}
              fill="url(#territoriesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = statIcons[i]
          return (
            <Card key={stat.label} dark={dark}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-laurelLeaf">{stat.label}</p>
                <Icon size={16} className="text-laurelLeaf" />
              </div>
              <p className={`mt-2 text-2xl font-semibold ${textPrimary}`}>{stat.value}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card dark={dark}>
          <h2 className={`text-sm font-medium ${textPrimary}`}>Eventos por status</h2>
          <p className="mb-4 text-xs text-laurelLeaf">Distribuição dos eventos comunitários</p>
          <StatusBars counts={data.eventsByStatus} labels={eventStatusLabel} dark={dark} />
        </Card>

        <Card dark={dark}>
          <h2 className={`text-sm font-medium ${textPrimary}`}>Anti-cheat por status</h2>
          <p className="mb-4 text-xs text-laurelLeaf">Distribuição das flags de anti-cheat</p>
          <StatusBars counts={data.antiCheatByStatus} labels={antiCheatStatusLabel} dark={dark} />
        </Card>
      </div>
    </div>
  )
}