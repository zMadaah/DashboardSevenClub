import { PaymentStatus } from '../../types'

export interface Payment {
  id: string
  userId: string
  userName: string
  amount: number
  status: PaymentStatus
  gateway: string
  gatewayReference: string | null
  paidAt: string
  createdAt: string
}
