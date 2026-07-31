import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { UserStatusItem } from '../../../features/home/types'

interface UserStatusDonutProps {
  data: UserStatusItem[]
  total: number
  dark?: boolean
}

export function UserStatusDonut({ data, total, dark = false }: UserStatusDonutProps) {
  const textPrimary = dark ? 'text-ceilingWhite' : 'text-richBlack'

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative h-56 w-56 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={90}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} usuários`, name]}
              contentStyle={
                dark
                  ? { borderRadius: 8, background: '#0E2222', borderColor: '#1C3333', fontSize: 12, color: '#E9EBE6' }
                  : { borderRadius: 8, borderColor: '#D2D3CE', fontSize: 12 }
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-laurelLeaf">Total</span>
          <span className={`text-2xl font-semibold ${textPrimary}`}>
            {total.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {data.map((item) => {
          const percentage = ((item.value / total) * 100).toFixed(1)
          return (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className={textPrimary}>{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${textPrimary}`}>
                  {item.value.toLocaleString('pt-BR')}
                </span>
                <span className="w-12 text-right text-xs text-laurelLeaf">{percentage}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}