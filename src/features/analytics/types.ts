export interface ActivityRow {
  id: string
  userId: string
  userName: string
  name: string
  activityType: 'run' | 'ride'
  distanceMeters: number
  durationSeconds: number
  loopClosed: boolean
  captureM2: number
  createdAt: string
}

export interface TerritoryDominanceRow {
  rank: number
  userId: string
  userName: string
  color: string
  territoryKm2: number
  cellsOwned: number
}

export interface DailySummaryRow {
  day: string
  activityCount: number
  distanceKm: number
  captureKm2: number
}
