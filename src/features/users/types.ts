import { UserStatus, UserRole } from '../../types'

export interface SupportUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  status: UserStatus
  role: UserRole
}