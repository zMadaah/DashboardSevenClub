import { PaymentStatus } from '../../types'

export interface Payment {
  id: string
  user: string
  amount: number
  status: PaymentStatus
  gateway: string
  date: string
}
