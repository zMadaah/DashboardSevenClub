import { Payment } from './types'

export const payments: Payment[] = [
  { id: 'pay_001', user: 'Marina Ferraz Souza', amount: 49.9, status: 'success', gateway: 'Stripe', date: '30/07/2026' },
  { id: 'pay_002', user: 'Kaique Andrade Lima', amount: 129.9, status: 'failed', gateway: 'PagSeguro', date: '30/07/2026' },
  { id: 'pay_003', user: 'Beatriz Nogueira Ramos', amount: 49.9, status: 'refunded', gateway: 'Stripe', date: '29/07/2026' },
  { id: 'pay_004', user: 'Thiago Villela Costa', amount: 249.9, status: 'disputed', gateway: 'Mercado Pago', date: '29/07/2026' },
  { id: 'pay_005', user: 'Ana Luiza Prado Martins', amount: 49.9, status: 'success', gateway: 'Stripe', date: '28/07/2026' },
  { id: 'pay_006', user: 'Rodrigo Bezerra Nunes', amount: 89.9, status: 'success', gateway: 'PagSeguro', date: '27/07/2026' },
]