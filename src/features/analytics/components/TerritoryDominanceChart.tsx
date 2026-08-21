import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { TerritoryDominanceRow } from '../types'

interface TerritoryDominanceChartProps {
  data: TerritoryDominanceRow[]
  dark?: boolean
}

export function TerritoryDominanceChart({ data, dark = false }: TerritoryDominanceChartProps) {
  const top10 = data.slice(0, 10).map((r) => ({
    name: r.userName,
    'Território (km²)': Number(r.territoryKm2.toFixed(3)),
    color: r.color,
  }))

  const gridColor = dark ? '#1C3333' : '#D2D3CE'
  const textColor = dark ? '#9CA3AF' : '#6b7280'

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top10} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: textColor }} axisLine={{ stroke: gridColor }} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 11, fill: textColor }}
            axisLine={{ stroke: gridColor }}
          />
          <Tooltip
            contentStyle={
              dark
                ? { borderRadius: 8, background: '#0E2222', borderColor: '#1C3333', fontSize: 12, color: '#E9EBE6' }
                : { borderRadius: 8, borderColor: '#D2D3CE', fontSize: 12 }
            }
          />
          <Bar dataKey="Território (km²)" radius={[0, 4, 4, 0]}>
            {top10.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
