import { RegionUserCount } from '../../../features/home/types'

interface RegionMapProps {
  data: RegionUserCount[]
}

// Layout esquemático (não geograficamente exato) das 5 macrorregiões do Brasil,
// posicionado para lembrar a disposição real: Norte no topo, Nordeste à direita,
// Centro-Oeste ao centro, Sudeste abaixo dele e Sul na base.
const REGION_SHAPES: Record<string, { x: number; y: number; w: number; h: number }> = {
  'Norte': { x: 20, y: 10, w: 170, h: 70 },
  'Nordeste': { x: 160, y: 85, w: 70, h: 75 },
  'Centro-Oeste': { x: 40, y: 85, w: 115, h: 75 },
  'Sudeste': { x: 120, y: 165, w: 90, h: 55 },
  'Sul': { x: 90, y: 225, w: 90, h: 40 },
}

export function RegionMap({ data }: RegionMapProps) {
  const maxUsers = Math.max(...data.map((d) => d.users))
  const sorted = [...data].sort((a, b) => b.users - a.users)

  const opacityFor = (users: number) => 0.18 + 0.72 * (users / maxUsers)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <svg viewBox="0 0 260 280" className="h-56 w-56 shrink-0">
        {data.map((item) => {
          const shape = REGION_SHAPES[item.region]
          if (!shape) return null
          return (
            <g key={item.region}>
              <rect
                x={shape.x}
                y={shape.y}
                width={shape.w}
                height={shape.h}
                rx={10}
                fill="#BCFF00"
                fillOpacity={opacityFor(item.users)}
                stroke="#96998C"
                strokeWidth={1}
              >
                <title>{`${item.region}: ${item.users.toLocaleString('pt-BR')} usuários`}</title>
              </rect>
              <text
                x={shape.x + shape.w / 2}
                y={shape.y + shape.h / 2 - 4}
                textAnchor="middle"
                fontSize={10}
                fill="#061414"
              >
                {item.region}
              </text>
              <text
                x={shape.x + shape.w / 2}
                y={shape.y + shape.h / 2 + 10}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="#061414"
              >
                {item.users.toLocaleString('pt-BR')}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="flex flex-1 flex-col gap-2">
        <p className="mb-1 text-xs text-laurelLeaf">Mapa esquemático — passe o mouse para detalhes</p>
        {sorted.map((item) => (
          <div key={item.region} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: '#BCFF00', opacity: opacityFor(item.users) }}
              />
              <span className="text-richBlack">{item.region}</span>
            </div>
            <span className="font-medium text-richBlack">{item.users.toLocaleString('pt-BR')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
