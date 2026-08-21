import { useMemo, useState } from 'react'
import { Activity, Users, Percent, Clock, ChevronDown } from 'lucide-react'
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
import { AnalyticsRange, StatusCounts } from './analyticsApi'

const statIcons = [Activity, Users, Percent, Clock]

const eventStatusLabel: Record<string, string> = {
  scheduled: 'Agendado',
  live: 'Ao vivo',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
}

const antiCheatStatusLabel: Record<string, string> = {
  pending_review: 'Pendente de revisão',
  confirmed: 'Confirmado',
  dismissed: 'Descartado',
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

// Converte "2026-08-02" em "02/08" sem passar por Date/timezone — evita o
// clássico bug de virar um dia pra trás dependendo do fuso do navegador.
function formatChartDate(iso: string): string {
  const [, month, day] = iso.split('-')
  return `${day}/${month}`
}

interface RangeOption {
  value: string
  label: string
  range: AnalyticsRange
}

function buildRangeOptions(): RangeOption[] {
  const options: RangeOption[] = [
    { value: 'days-7', label: 'Últimos 7 dias', range: { days: 7 } },
    { value: 'days-15', label: 'Últimos 15 dias', range: { days: 15 } },
    { value: 'days-30', label: 'Últimos 30 dias', range: { days: 30 } },
  ]

  const now = new Date()
  for (let i = 0; i < 6; i++) {
    const year = now.getFullYear()
    const month = now.getMonth() + 1 - i
    const normalizedMonth = ((month - 1 + 12) % 12) + 1
    const normalizedYear = year + Math.floor((month - 1) / 12)
    const label = i === 0 ? `${MONTH_NAMES[normalizedMonth - 1]} (mês atual)` : `${MONTH_NAMES[normalizedMonth - 1]} ${normalizedYear}`
    options.push({
      value: `month-${normalizedYear}-${normalizedMonth}`,
      label,
      range: { year: normalizedYear, month: normalizedMonth },
    })
  }

  return options
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

  const rangeOptions = useMemo(buildRangeOptions, [])
  const [rangeValue, setRangeValue] = useState(rangeOptions[0].value)
  const selectedRange = rangeOptions.find((o) => o.value === rangeValue) ?? rangeOptions[0]

  const { data, isLoading, error } = useAnalyticsOverview(selectedRange.range)

  // No fundo claro, as cores "apagadas" (pear muito claro, laurelLeaf acinzentado)
  // perdem contraste contra o branco — usamos tons mais escuros só nesse caso.
  const activitiesColor = dark ? '#BCFF00' : '#7A9900'
  const territoriesColor = dark ? '#96998C' : '#5C6154'

  const gridStroke = dark ? '#1C3333' : '#D2D3CE'
  const axisStroke = dark ? '#96998C' : '#6B6E63'
  const tooltipStyle = dark
    ? { background: '#0E2222', borderColor: '#1C3333', borderRadius: 8, fontSize: 12, color: '#E9EBE6' }
    : { background: '#FFFFFF', borderColor: '#D2D3CE', borderRadius: 8, fontSize: 12, color: '#061414' }

  const selectClass = `appearance-none rounded-lg border py-1.5 pl-3 pr-8 text-xs font-medium outline-none focus:border-pear ${
    dark ? 'border-surfaceBorder bg-richBlack text-ceilingWhite' : 'border-celeste bg-ceilingWhite text-richBlack'
  }`

  if (isLoading && !data) {
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

  const pointCount = data.weeklyActivity.length
  const xAxisInterval = pointCount > 12 ? Math.ceil(pointCount / 10) - 1 : 0

  return (
    <div className="flex flex-col gap-4">
      <Card dark={dark}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className={`text-sm font-medium ${textPrimary}`}>Atividade semanal</h2>
            <p className="mb-4 text-xs text-laurelLeaf">Corridas/pedaladas e territórios capturados por dia</p>
          </div>
          <div className="relative">
            <select
              value={rangeValue}
              onChange={(e) => setRangeValue(e.target.value)}
              className={selectClass}
            >
              {rangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-laurelLeaf"
            />
          </div>
        </div>

        <div className="mb-3 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-laurelLeaf">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activitiesColor }} /> Atividades
          </span>
          <span className="flex items-center gap-1.5 text-laurelLeaf">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: territoriesColor }} /> Territórios capturados
          </span>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.weeklyActivity} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="activitiesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activitiesColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={activitiesColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="territoriesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={territoriesColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={territoriesColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatChartDate}
              interval={xAxisInterval}
              stroke={axisStroke}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis stroke={axisStroke} tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(label) => (typeof label === 'string' ? formatChartDate(label) : label)}
            />
            <Area
              type="monotone"
              dataKey="activities"
              name="Atividades"
              stroke={activitiesColor}
              strokeWidth={2}
              fill="url(#activitiesGradient)"
            />
            <Area
              type="monotone"
              dataKey="territories"
              name="Territórios capturados"
              stroke={territoriesColor}
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