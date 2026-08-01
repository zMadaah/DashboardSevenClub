import { CommunityEvent } from './types'

export const events: CommunityEvent[] = [
  {
    id: 'evt_001',
    name: 'Batalha de Crews — Zona Leste vs Zona Sul',
    date: '02/08/2026 08:00',
    location: 'Parque do Carmo, São Paulo',
    participants: 84,
    status: 'scheduled',
  },
  {
    id: 'evt_002',
    name: 'Corrida Coletiva Parque Ibirapuera',
    date: '31/07/2026 07:00',
    location: 'Parque Ibirapuera, São Paulo',
    participants: 41,
    status: 'live',
  },
  {
    id: 'evt_003',
    name: 'Desafio Pedal SP',
    date: '20/07/2026 09:00',
    location: 'Parque Villa-Lobos, São Paulo',
    participants: 63,
    status: 'finished',
  },
  {
    id: 'evt_004',
    name: 'Territory Rush — edição julho',
    date: '15/07/2026 18:00',
    location: 'Parque da Aclimação, São Paulo',
    participants: 12,
    status: 'cancelled',
  },
]