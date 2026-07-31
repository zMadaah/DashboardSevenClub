import { AntiCheatCase } from './types'

export const cases: AntiCheatCase[] = [
  { id: 'ac_001', user: 'Marina Alves', anomaly: 'Velocidade incompatível com corrida (32km/h)', riskScore: 91, status: 'pending', date: '31/07/2026' },
  { id: 'ac_002', user: 'Rafael Souza', anomaly: 'Teleporte entre pontos do trajeto', riskScore: 78, status: 'pending', date: '30/07/2026' },
  { id: 'ac_003', user: 'Bia Fernandes', anomaly: 'Loop de território geometricamente impossível', riskScore: 65, status: 'approved', date: '28/07/2026' },
  { id: 'ac_004', user: 'Lucas Prado', anomaly: 'Reincidência — 2ª flag em 30 dias', riskScore: 88, status: 'warned', date: '25/07/2026' },
]
