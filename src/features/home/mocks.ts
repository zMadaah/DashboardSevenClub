import {
  SummaryCard,
  RegionUserCount,
  RecentPayment,
  WeeklyActivityPoint,
  AnalyticsStat,
  ChannelValue,
  DeviceShare,
} from './types'

// "Tickets abertos" não é um número independente — é a soma das 3 origens de ticket abaixo.
const paymentFailuresToday = 3
const antiCheatQueueCount = 7
const recentReportsCount = 4
const ticketsAbertosCount = paymentFailuresToday + antiCheatQueueCount + recentReportsCount

export const summaryCards: SummaryCard[] = [
  { label: 'Tickets abertos', value: ticketsAbertosCount, trend: '+3 desde ontem' },
  { label: 'Falhas de pagamento hoje', value: paymentFailuresToday, trend: '-1 vs. média diária' },
  { label: 'Fila anti-cheat', value: antiCheatQueueCount, trend: '+2 esta semana' },
  { label: 'Denúncias recentes', value: recentReportsCount, trend: 'estável esta semana' },
]

// userStatusBreakdown/totalUsers saíram daqui — agora vêm de verdade da API
// via useSubscriptionSummary() (GET /users/subscription-summary).

export const usersByRegion: RegionUserCount[] = [
  { region: 'Sudeste', users: 1120 },
  { region: 'Sul', users: 520 },
  { region: 'Nordeste', users: 350 },
  { region: 'Centro-Oeste', users: 150 },
  { region: 'Norte', users: 90 },
]

export const recentPayments: RecentPayment[] = [
  { id: 'rp_001', name: 'Marina Ferraz Souza', initials: 'MF', gateway: 'Stripe', amount: 49.9 },
  { id: 'rp_002', name: 'Ana Luiza Prado Martins', initials: 'AL', gateway: 'Stripe', amount: 49.9 },
  { id: 'rp_003', name: 'Rodrigo Bezerra Nunes', initials: 'RB', gateway: 'PagSeguro', amount: 89.9 },
  { id: 'rp_004', name: 'Lucas Prado', initials: 'LP', gateway: 'Mercado Pago', amount: 29.9 },
  { id: 'rp_005', name: 'Camila Duarte', initials: 'CD', gateway: 'Stripe', amount: 49.9 },
]

export const weeklyActivity: WeeklyActivityPoint[] = [
  { day: 'Seg', activities: 620, territories: 180 },
  { day: 'Ter', activities: 480, territories: 210 },
  { day: 'Qua', activities: 540, territories: 340 },
  { day: 'Qui', activities: 610, territories: 300 },
  { day: 'Sex', activities: 980, territories: 460 },
  { day: 'Sáb', activities: 1120, territories: 430 },
  { day: 'Dom', activities: 860, territories: 260 },
]

export const analyticsStats: AnalyticsStat[] = [
  { label: 'Atividades registradas', value: '5.210', trend: '+12,4% vs. semana passada' },
  { label: 'Usuários ativos', value: '1.340', trend: '+5,8% vs. semana passada' },
  { label: 'Taxa de cancelamento', value: '4,2%', trend: '-0,8% vs. semana passada' },
  { label: 'Tempo médio de resposta', value: '3m 24s', trend: '+18s vs. semana passada' },
]

export const acquisitionChannels: ChannelValue[] = [
  { name: 'Instagram', value: 620 },
  { name: 'Orgânico', value: 410 },
  { name: 'Indicação', value: 180 },
  { name: 'Outros', value: 38 },
]

export const deviceShare: DeviceShare[] = [
  { name: 'iOS', percentage: 62 },
  { name: 'Android', percentage: 38 },
]