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
import {
  weeklyActivity,
  analyticsStats,
  acquisitionChannels,
  deviceShare,
} from './mocks'

const statIcons = [Activity, Users, Percent, Clock]

export function AnalyticsOverview() {
  const maxChannel = Math.max(...acquisitionChannels.map((c) => c.value))

  return (
    <div className="flex flex-col gap-4">
      <Card dark>
        <h2 className="text-sm font-medium text-ceilingWhite">Atividade semanal</h2>
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
          <AreaChart data={weeklyActivity} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#1C3333" vertical={false} />
            <XAxis dataKey="day" stroke="#96998C" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis stroke="#96998C" tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
              contentStyle={{
                background: '#0E2222',
                borderColor: '#1C3333',
                borderRadius: 8,
                fontSize: 12,
                color: '#E9EBE6',
              }}
            />
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
        {analyticsStats.map((stat, i) => {
          const Icon = statIcons[i]
          return (
            <Card key={stat.label} dark>
              <div className="flex items-center justify-between">
                <p className="text-sm text-laurelLeaf">{stat.label}</p>
                <Icon size={16} className="text-laurelLeaf" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-ceilingWhite">{stat.value}</p>
              <p className="mt-1 text-xs text-pear">{stat.trend}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card dark>
          <h2 className="text-sm font-medium text-ceilingWhite">Canais de aquisição</h2>
          <p className="mb-4 text-xs text-laurelLeaf">De onde vêm os novos usuários</p>
          <div className="flex flex-col gap-3">
            {acquisitionChannels.map((c) => (
              <div key={c.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ceilingWhite">{c.name}</span>
                  <span className="font-medium text-ceilingWhite">
                    {c.value.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full bg-pear"
                    style={{ width: `${(c.value / maxChannel) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card dark>
          <h2 className="text-sm font-medium text-ceilingWhite">Dispositivos</h2>
          <p className="mb-4 text-xs text-laurelLeaf">Como os usuários acessam o app</p>
          <div className="flex flex-col gap-3">
            {deviceShare.map((d) => (
              <div key={d.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ceilingWhite">{d.name}</span>
                  <span className="font-medium text-ceilingWhite">{d.percentage}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10">
                  <div className="h-1.5 rounded-full bg-pear" style={{ width: `${d.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}