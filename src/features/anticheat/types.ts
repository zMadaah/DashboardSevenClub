import { AntiCheatStatus } from '../../types'

export interface ActivityRoute {
  type: 'LineString'
  coordinates: [number, number][]
}

export interface AntiCheatCase {
  id: string
  user: string
  anomaly: string
  riskScore: number
  status: AntiCheatStatus
  date: string
  activity: {
    distanceMeters: number
    durationSeconds: number
    route: ActivityRoute | null
  }
}