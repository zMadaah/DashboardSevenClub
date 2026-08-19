
import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { ApiError } from '../../lib/api'
import { getMessages, sendStaffMessage, updateTicketStatus, ChatMessage } from './api'

// Não é WebSocket — buscar de novo a cada poucos segundos já dá a
// sensação de "chegou na hora" sem precisar de infraestrutura de tempo
// real. Intervalo menor que o da lista de tickets porque, com a
// conversa aberta, uma resposta demorada é mais perceptível.
const POLL_INTERVAL_MS = 3000

// Mensagem que o usuário vê no app quando o staff encerra o atendimento
// (por "/finalizar" ou pelo botão). Deixa claro que dá pra reabrir só
// mandando mensagem de novo — o backend já reabre automaticamente
// (support.service.ts marca como "new" a cada mensagem do usuário).
const CLOSING_MESSAGE =
  'Conversa encerrada pelo suporte. Se precisar de algo mais, é só mandar uma mensagem por aqui que reabrimos o atendimento.'

export function useMessages(ticketId: string | null) {
  const { token } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!ticketId) {
      setMessages([])
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    getMessages(ticketId, token)
      .then((data) => {
        if (cancelled) return
        setMessages(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar mensagens')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [ticketId, token])

  // Poll silencioso enquanto uma conversa está aberta — é assim que a
  // mensagem que o usuário manda pelo app aparece pro staff sem precisar
  // trocar de ticket e voltar.
  useEffect(() => {
    if (!ticketId) return

    const interval = setInterval(() => {
      getMessages(ticketId, token)
        .then((data) => setMessages(data))
        .catch(() => {})
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [ticketId, token])

  async function send(message: string) {
    if (!ticketId || !message.trim()) return
    setSending(true)
    try {
      const created = await sendStaffMessage(ticketId, message.trim(), token)
      setMessages((prev) => [...prev, created])
    } finally {
      setSending(false)
    }
  }

  // Manda a mensagem de encerramento e marca o ticket como resolvido.
  // As duas coisas juntas: só marcar "resolved" sem avisar deixaria o
  // usuário sem entender por que ninguém respondeu mais.
  async function closeConversation() {
    if (!ticketId) return
    setSending(true)
    try {
      const created = await sendStaffMessage(ticketId, CLOSING_MESSAGE, token)
      setMessages((prev) => [...prev, created])
      await updateTicketStatus(ticketId, 'resolved', token)
    } finally {
      setSending(false)
    }
  }

  return { messages, isLoading, error, sending, send, closeConversation }
}