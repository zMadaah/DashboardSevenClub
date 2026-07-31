import { ChatTicket } from './types'

export const tickets: ChatTicket[] = [
  { id: 'tkt_001', user: 'Marina Alves', lastMessage: 'Não consigo fechar meu território', status: 'new', updatedAt: 'há 5 min' },
  { id: 'tkt_002', user: 'Rafael Souza', lastMessage: 'App não sincroniza com o Strava', status: 'in_progress', updatedAt: 'há 20 min' },
  { id: 'tkt_003', user: 'Bia Fernandes', lastMessage: 'Cobrança duplicada esse mês', status: 'in_progress', updatedAt: 'há 1h' },
  { id: 'tkt_004', user: 'Lucas Prado', lastMessage: 'Obrigado, resolvido!', status: 'resolved', updatedAt: 'ontem' },
]

export const quickReplies = [
  'Pode nos enviar um print do erro?',
  'Território indisponível pode levar até 5 min para atualizar — já verificou?',
  'Vamos escalar isso para a análise de anti-cheat.',
]
