import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { DailySummaryRow } from '../types'

interface ActivitiesChartProps {
  data: DailySummaryRow[]
  dark?: boolean
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function ActivitiesChart({ data, dark = false }: ActivitiesChartProps) {
  const chartData = data.map((r) => ({
    day: formatDay(r.day),
    'Distância (km)': Number(r.distanceKm.toFixed(1)),
    Atividades: r.activityCount,
  }))

  const gridColor = dark ? '#1C3333' : '#D2D3CE'
  const textColor = dark ? '#9CA3AF' : '#6b7280'

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: textColor }} axisLine={{ stroke: gridColor }} />
          <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={{ stroke: gridColor }} />
          <Tooltip
            contentStyle={
              dark
                ? { borderRadius: 8, background: '#0E2222', borderColor: '#1C3333', fontSize: 12, color: '#E9EBE6' }
                : { borderRadius: 8, borderColor: '#D2D3CE', fontSize: 12 }
            }
          />
          <Bar dataKey="Distância (km)" fill="#BCFF00" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
