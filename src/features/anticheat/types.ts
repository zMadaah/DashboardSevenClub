import { AntiCheatStatus } from '../../types'

export interface AntiCheatCase {
  id: string
  user: string
  anomaly: string
  riskScore: number
  status: AntiCheatStatus
  date: string
}
