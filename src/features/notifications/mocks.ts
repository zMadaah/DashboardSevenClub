import { NotificationRecord, NotificationAudience } from './types'

export const audienceLabel: Record<NotificationAudience, string> = {
  all: 'Todos os usuários',
  subscribers: 'Assinantes',
  free: 'Free',
  cancelled: 'Cancelados',
  inactive: 'Usuários inativos',
}

// Alcance estimado por segmento — hoje espelha os números do donut "Usuários por status"
// da Home. Quando a API real existir, isso vira uma consulta de contagem por segmento.
export const estimatedReach: Record<NotificationAudience, number> = {
  all: 2230,
  subscribers: 860,
  free: 1240,
  cancelled: 130,
  inactive: 340,
}

export const notificationHistory: NotificationRecord[] = [
  {
    id: 'ntf_001',
    title: 'Novo desafio: Batalha de Crews',
    message: 'Participe da batalha de crews deste fim de semana e capture território!',
    audience: 'all',
    status: 'sent',
    reach: 2230,
    date: '30/07/2026 14:20',
  },
  {
    id: 'ntf_002',
    title: 'Sua assinatura está prestes a expirar',
    message: 'Renove agora e continue defendendo seu território.',
    audience: 'subscribers',
    status: 'sent',
    reach: 860,
    date: '28/07/2026 09:00',
  },
  {
    id: 'ntf_003',
    title: 'Sentimos sua falta!',
    message: 'Volte a correr com a gente — seu território te espera.',
    audience: 'inactive',
    status: 'scheduled',
    reach: 340,
    date: '02/08/2026 08:00',
  },
  {
    id: 'ntf_004',
    title: 'Novidade chegando',
    message: 'Em breve: integração com Apple Health.',
    audience: 'all',
    status: 'draft',
    reach: 0,
    date: '—',
  },
]