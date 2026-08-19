import { Payment } from './types'

export const payments: Payment[] = [
  { id: 'pay_001', userId: 'usr_001', userName: 'Marina Ferraz Souza', amount: 49.9, status: 'success', gateway: 'Stripe', gatewayReference: 'ch_1Nx3aB', paidAt: '2026-07-30T14:20:00Z', createdAt: '2026-07-30T14:19:40Z' },
  { id: 'pay_002', userId: 'usr_002', userName: 'Kaique Andrade Lima', amount: 129.9, status: 'failed', gateway: 'PagSeguro', gatewayReference: null, paidAt: '2026-07-30T09:05:00Z', createdAt: '2026-07-30T09:04:50Z' },
  { id: 'pay_003', userId: 'usr_003', userName: 'Beatriz Nogueira Ramos', amount: 49.9, status: 'refunded', gateway: 'Stripe', gatewayReference: 'ch_1Nx1cD', paidAt: '2026-07-29T18:42:00Z', createdAt: '2026-07-29T18:41:30Z' },
  { id: 'pay_004', userId: 'usr_004', userName: 'Thiago Villela Costa', amount: 249.9, status: 'disputed', gateway: 'Mercado Pago', gatewayReference: 'mp_88213aa', paidAt: '2026-07-29T11:15:00Z', createdAt: '2026-07-29T11:14:20Z' },
  { id: 'pay_005', userId: 'usr_005', userName: 'Ana Luiza Prado Martins', amount: 49.9, status: 'success', gateway: 'Stripe', gatewayReference: 'ch_1Nwz9E', paidAt: '2026-07-28T16:30:00Z', createdAt: '2026-07-28T16:29:45Z' },
  { id: 'pay_006', userId: 'usr_006', userName: 'Rodrigo Bezerra Nunes', amount: 89.9, status: 'success', gateway: 'PagSeguro', gatewayReference: 'pgs_55af12', paidAt: '2026-07-27T10:00:00Z', createdAt: '2026-07-27T09:59:50Z' },
]