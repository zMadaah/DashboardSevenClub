import {
  RegionUserCount,
  // WeeklyActivityPoint,
  // AnalyticsStat,
  // ChannelValue,
  // DeviceShare,
} from './types'

// summaryCards e recentPayments saíram daqui — agora vêm de verdade da API
// via useHomeSummary() e useRecentPayments().
// userStatusBreakdown/totalUsers também já saíram (useSubscriptionSummary()).

// usersByRegion continua mockado: não existe campo de região em app_users
// nem na API ainda — precisaria decidir se isso vem de um cadastro manual
// ou é derivado da localização das atividades, antes de conectar de verdade.
export const usersByRegion: RegionUserCount[] = [
  { region: 'Sudeste', users: 1120 },
  { region: 'Sul', users: 520 },
  { region: 'Nordeste', users: 350 },
  { region: 'Centro-Oeste', users: 150 },
  { region: 'Norte', users: 90 },
]

// Os dados da aba "Análises" abaixo também continuam mockados — dependem de
// infraestrutura que ainda não existe (canal de aquisição, tipo de dispositivo
// não são rastreados em lugar nenhum do sistema hoje).

// export const weeklyActivity: WeeklyActivityPoint[] = [
//   { day: 'Seg', activities: 620, territories: 180 },
//   { day: 'Ter', activities: 480, territories: 210 },
//   { day: 'Qua', activities: 540, territories: 340 },
//   { day: 'Qui', activities: 610, territories: 300 },
//   { day: 'Sex', activities: 980, territories: 460 },
//   { day: 'Sáb', activities: 1120, territories: 430 },
//   { day: 'Dom', activities: 860, territories: 260 },
// ]

// export const analyticsStats: AnalyticsStat[] = [
//   { label: 'Atividades registradas', value: '5.210', trend: '+12,4% vs. semana passada' },
//   { label: 'Usuários ativos', value: '1.340', trend: '+5,8% vs. semana passada' },
//   { label: 'Taxa de cancelamento', value: '4,2%', trend: '-0,8% vs. semana passada' },
//   { label: 'Tempo médio de resposta', value: '3m 24s', trend: '+18s vs. semana passada' },
// ]

// export const acquisitionChannels: ChannelValue[] = [
//   { name: 'Instagram', value: 620 },
//   { name: 'Orgânico', value: 410 },
//   { name: 'Indicação', value: 180 },
//   { name: 'Outros', value: 38 },
// ]

// export const deviceShare: DeviceShare[] = [
//   { name: 'iOS', percentage: 62 },
//   { name: 'Android', percentage: 38 },
// ]